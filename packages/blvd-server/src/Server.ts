import micro from 'micro' // TODO: Consider Node 4 support? Micro only supports 6+ but Express sucks
import { IncomingMessage, ServerResponse } from 'http'
import { Client } from 'blvd-client'

interface Renderer {
  (bundle: string, request: IncomingMessage, response: ServerResponse, pathname: string, query: object): string
}

class Server {
  // The compilePath stores where the last compiled version of the client is stored.
  protected compilePath: string

  // This is the backing micro server.
  private server

  constructor (private client: Client) {
    this.server = micro(this.handle) // > express in 2017
    this.setCompilePath()
  }

  // This starts the server.
  public start (port: (number | string) = 8080): void {
    this.server.listen(port)
  }

  // The handle function is passed the request object and the response object, and
  // expected to do something with it. Whatever it does is up to you. By default,
  // it takes the compiled path and wraps the contents of the file in a <script>
  // tag in a barebones html file. Very simple.
  protected async handle (req: IncomingMessage, res: ServerResponse): Promise<string> {
    return await Promise.resolve('NOT YET IMPLEMENTED')
  }

  // We run this to set the compile path, since client.compile() is async. Hot swap
  // servers or anything which wants to mess with the internals can also call this to
  // force a re-compile of the client.
  protected async setCompilePath (): Promise<void> {
    this.compilePath = await this.client.compile()
  }
}

export default Server
