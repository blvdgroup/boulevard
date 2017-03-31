import { join as pathJoin } from 'path'
import micro from 'micro' // TODO: Consider Node 4 support? Micro only supports 6+ but Express sucks
import { IncomingMessage, ServerResponse } from 'http'
import { parse as parseURL } from 'url'
import { watch as watchFile } from 'chokidar'
import { readFile } from 'async-file'

interface Bundler {
  (path: string): Promise<string>
}

interface Renderer {
  (bundle: string, request: IncomingMessage, response: ServerResponse, pathname: string, query: object): string
}

class Server {
  private server
  private clientBundle: string

  constructor (
    private bundle: (Bundler | undefined),
    private render: (Renderer | undefined),
    private clientPath: string = pathJoin(process.cwd + 'client'),
    private devMode: boolean = true
  ) {
    this.server = micro(this.handle)
    // The constructor optionally accepts a bundle function, which allows you to add some sort of bundling step to your server.
    // The bundle function is passed the client path and the url requested, and should return the entire bundle as a string.
    if (devMode) {
      // If we're in development, we watch the client folder for changes.
      const watcher = watchFile(pathJoin(clientPath + '**/*'))
      const handleUpdate = async () => await this.makeBundle
      watcher.on('change', handleUpdate)
      watcher.on('unlink', handleUpdate)
    }
  }

  public async handle (req: IncomingMessage, res: ServerResponse): Promise<string> {
    const url = parseURL(req.url as string, true)
    const pathname = url.pathname as string || '/'
    const query = url.query as object || {}
    // If we have some sort of render function, we pass the render function some stuff and expect it to spit out a string.
    const rendered = this.render ? await this.render(this.clientBundle, req, res, pathname, query) : this.wrap(this.clientBundle)
    return rendered
    // TODO: Handle certain special routes specially.
  }

  public start (port: (number | string) = 8080): void {
    this.server.listen(port)
  }

  private wrap (b: string): string {
    // TODO
    // Output the bundle with a barebones HTML page surrounding it.
    return b
  }

  private async makeBundle (clientPath: string): Promise<string> {
    // If there's a change, we bundle again and save it to memory.
    // TODO: Write bundle to a file instead of saving to memory?
    // TODO: Shouldn't be assuming UTF-8 encoding. How do I handle this better?
    const bundler: Bundler = this.bundle
      ? this.bundle as Bundler
      : async (path: string) => await readFile(pathJoin(clientPath, 'index.js'), { encoding: 'utf8' }) as string
    const bundled = await bundler(clientPath)
    return bundled
  }

  // TODO: boulevard specific functions like add contexts, add models, etc
}

// Sample use:
//
// ```
// import { Server } from 'blvd-server'
// import * as contexts from '../common/contexts'
//
// const s = new Server()
//
// s.addContexts(contexts)
//
// s.start()
// ```

export default Server
