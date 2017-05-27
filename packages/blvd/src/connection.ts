import { EventEmitter2 as EE } from 'eventemitter2'
import { randomBytes } from 'crypto-promise'

import { Result, Status } from 'blvd-utils'

import { getContextType, ContextType } from './context'
import ModelConstructor from './Model/ModelConstructor'

const connectionPasser = new EE()

export type EventHandler = (event: string, callback: (...args: any[]) => any) => any

// The ConnectionLayer is the shared layer through which both types of connection are parsed through. Although a raw client connection and
// a raw server connection look different, we construct them to have the same API (outlined here, very similar to an EventEmitter) and then
// wrap _that_ with the Connection class for more advanced use (sharing properties, etc).
//
// The important thing to note about the connection layer is that although it may look the same as an EventEmitter it is constructed so that
// running an emit call on the client should ONLY trigger event handlers on the server, and vice versa.
export interface ConnectionLayer {
  on: EventHandler,
  once: EventHandler,
  emit: (event: string, ...args: any[]) => any
}

export class Connection {
  private properties: any
  private contextType: ContextType = getContextType()

  constructor(private layer: ConnectionLayer) {
    this.layer.on('generate-id', () => {
      if (this.contextType === ContextType.SERVER) {
        this.generateId()
      }
    })

    this.layer.on('assign', (property: string, value: any) => {
      this.properties[property] = value
      this.layer.emit(`assignResponse-${property}`, { status: Status.SUCCESS })
    })

    this.layer.on('request', (property: string) => {
      const prop = this.properties[property]
      if (prop) {
        this.layer.emit(`response-${property}`, { status: Status.SUCCESS }, prop)
      } else {
        this.layer.emit(`response-${property}`, { status: Status.FAILURE, error: 'Property does not exist over here.' }, null)
      }
    })

    if (getContextType() === ContextType.SERVER) {
      this.layer.on('make-item', (attemptId: string, name: string, props: object) => {
        // TODO
      })
    }
  }

  public async getId(): Promise<string> {
    // let's ask the other end of this connection if they know the id
    const [ result, id ] = await this.ask('id')
    if (result.status === Status.SUCCESS) return id

    // ok... well it looks like neither of us knows the id of this connection let's make one
    if (this.contextType === ContextType.CLIENT) {
      // we're a client we'll let the server handle generating a connection
      return this.waitForId()
    } else if (this.contextType === ContextType.SERVER) {
      // we're a server let's make a gosh darn id
      return this.generateId()
    }

    throw new Error('Tried to get the ID of our connection, but somehow managed to break everything instead.')
  }

  public async makeItem(model: ModelConstructor, props: object = {}): Promise<string> {
    // if we're a server: wait, what
    if (getContextType() === ContextType.SERVER)
      throw new Error('Attempted to ask the server to make an item while also being the server.')

    // just wanna take this comment to suggest the song "death, thrice drawn" by the scary jokes
    // it's uh floating around tumblr at the time of this comment but it'll probably make its way onto an lp at some point
    // they're on bandcamp and really cool

    // this is hacky. we have to communicate using the model's name to the other end, because transmitting the whole model across seems like
    // well a bad idea, in general. sorta pointless.
    const name = model.prototype.constructor.name
    const attemptId = Math.random().toString(16).slice(2, 11)
    this.layer.emit('make-item', attemptId, name, props)
    return new Promise((resolve: (id: string) => void, reject: (reason?: any) => void) => {
      this.layer.once(`make-item-result-${attemptId}`, (result: Result, id: string) => {
        if (result.status === Status.SUCCESS) resolve(id)
        throw new Error(`Couldn't make an item on the server end, because ${result.error}.`)
      })
    })
  }

  private async generateId(): Promise<string> {
    // before we do any of this... do we already have an id?
    // just in case, let's check - async stuff can get messy sometimes
    if (this.properties.id) return this.properties.id

    // ok we don't let's make one
    const id = (await randomBytes(32)).toString('hex')
    await this.assign('id', id)
    this.layer.emit('id', id)
    return id
  }

  private async waitForId(): Promise<string> {
    this.layer.emit('generate-id')

    // Is there, like, a better way to write promises where I can skip this line?
    // Or just make it ((resolve, reject) => {}) like I used to?
    // Oh well, Promise constructor is an anti-pattern anyway or something.
    return new Promise((resolve: (...args: any[]) => any, reject: (...args: any[]) => any) => {
      this.layer.once('id', (id: string) => { resolve(id) })
    })
  }

  private async ask(property: string): Promise<[Result, any]> {
    // check if we already know the property
    if (this.properties[property]) return this.properties[property]

    // ask for the property
    this.layer.emit(`request`, property)

    return new Promise((resolve: (...args: any[]) => any, reject: (...args: any[]) => any) => {
      this.layer.once(`response-${property}`, (result: Result, resp: any) => { resolve([result, resp]) })
    })
  }

  private async assign(property: string, value: any): Promise<Result> {
    this.layer.emit(`assign`, property, value)

    return new Promise((resolve: (...args: any[]) => any, reject: (...args: any[]) => any) => {
      this.layer.once(`assignResponse-${property}`, (result: Result) => { resolve(result) })
    })
  }
}

// In both of the below handlers, we take the raw connection object from either the blvd client or server and wrap it in a ConnectionLayer,
// before passing the ConnectionLayer onto a new Connection object.

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
    return new Promise((resolve: (connection: Connection) => void, reject: (reason?: any) => void) => {
      connectionPasser.once('connection', (c: Connection) => { resolve(c) })
    })
  },
  emit: (event: string, ...args: any[]) => connectionPasser.emit(event, ...args),
  on: (event: string, callback: (...args: any[]) => any) => connectionPasser.on(event, callback),
  once: (event: string, callback: (...args: any[]) => any) => connectionPasser.on(event, callback)
}
