import micro from 'micro' // TODO: Consider Node 4 support? Micro only supports 6+ but Express sucks
import { IncomingMessage, ServerResponse } from 'http'

interface Renderer {
  (bundle: string, request: IncomingMessage, response: ServerResponse, pathname: string, query: object): string
}

class Server {
  private server

  constructor (
    private render: (Renderer | undefined)
  ) {
    this.server = micro(this.handle)
  }

  public async handle (req: IncomingMessage, res: ServerResponse): Promise<string> {
    // TODO
    return await Promise.resolve('NOT YET IMPLEMENTED')
  }

  public start (port: (number | string) = 8080): void {
    this.server.listen(port)
  }
}

export default Server
