import micro from 'micro' // TODO: Consider Node 4 support? Micro only supports 6+ but Express sucks
import { IncomingMessage, ServerResponse } from 'http'
import { Client } from 'blvd-client'
import { Server as WSServer } from 'ws'
import { Server as HTTPServer } from 'http'

interface ServerOptions {
  port: number
}

class Server {
  // The compilePath stores where the last compiled version of the client is stored.
  protected compilePath: string

  // This is the backing micro server.
  private server: HTTPServer

  // This is the websocket server.
  private wsServer: WSServer

  constructor (
    private client: Client,
    private options: ServerOptions = { port: 8080 }
  ) {
    this.server = micro(this.handleHttpRequest) // > express in 2017
    const server = this.server
    this.wsServer = new WSServer({ server })
    this.wsServer.on('connection', this.handleWsRequest)
    this.setCompilePath()
  }

  // This starts the server.
  public start (): void {
    this.server.listen(this.options.port)
  }

  // The handleHttpRequest function is passed the request object and the response object, and
  // expected to do something with it. Whatever it does is up to you. By default, it takes
  // the compiled path and wraps the contents of the file in a <script> tag in a barebones
  // html file. If you were using some sort of server rendering framework, you might instead
  // override this function to utilize such a framework. Better yet, you'd use some sort of
  // adapter which already did this for you!
  protected async handleHttpRequest (req: IncomingMessage, res: ServerResponse): Promise<string> {
    return await Promise.resolve('NOT YET IMPLEMENTED')
  }

  // The handleWsRequest handles websocket requests, much like the handleHttpRequest handles
  // http requests. However, it's generally not a good idea to override this. I can't think of
  // a possible use case for it yet, but hey, you're the programmer here, not me.
  protected async handleWsRequest (): Promise<void> {
    // NOT YET IMPLEMENTED
  }

  // We run this to set the compile path, since client.compile() is async. Hot swap
  // servers or anything which wants to mess with the internals can also call this to
  // force a re-compile of the client.
  protected async setCompilePath (): Promise<void> {
    this.compilePath = await this.client.compile()
  }
}

export default Server
