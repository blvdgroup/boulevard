import { EventEmitter2 as EE } from 'eventemitter2'

const connectionPasser = new EE()

connectionPasser.on('connection-client-raw', (c: any): void => {
  // Parse connection from a client object into a unified API
  // TODO

  // The connection passed from the client will be a raw WebSocket object, see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
  // We wrap this with an EventEmitter. Also might just use socketio for interop but socketio is slow and big so who knows?
  connectionPasser.on('connection', c)
})

connectionPasser.on('connection-server-raw', (c: any): void => {
  // Parse connection from a server object into a unified API
  // TODO

  // The connection passed from the server will be a uws connection object (i.e. what is passed in WebSocketServer.on('connection'))
  // https://www.npmjs.com/package/uws for info about that package, although it is not directly required in blvd because it has native
  // addons we don't wanna throw in browser.
  connectionPasser.on('connection', c)
})

export default {
  requestConnection: () => {
    connectionPasser.emit('request-connection')
    return new Promise((resolve: (...args: any[]) => any, reject: (...args: any[]) => any) => {
      connectionPasser.once('connection', resolve)
    })
  },
  emit: (event: string, ...args: any[]) => connectionPasser.emit(event, ...args),
  on: (event: string, callback: () => any) => connectionPasser.on(event, callback),
  once: (event: string, callback: () => any) => connectionPasser.on(event, callback)
}
