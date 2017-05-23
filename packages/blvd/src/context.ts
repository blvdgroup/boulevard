// This function is used to determine the context that the app is running in.

import connection from './connection'

export enum ContextType {
  SERVER,
  CLIENT
}

export interface Context {
  type: ContextType,
  id?: string
}

const determineId = async (): Promise<string> => {
  // Every client gets a unique ID which identifies it to the server. This is also included in the context.

  // First, get the underlying connection.
  // TODO
  // const c = await connection.requestConnection()

  // TODO: Use unified API to get connection id. Probably just a getId() call?
  return 'id'
}

declare var process
declare var window

export const getContextType = (): ContextType => {
  // First we're gonna try to find if we're a client or server.

  // The first and simplest way is checking the BLVD_CONTEXT environment variable.
  // If we use webpack's DefinePlugin to set BLVD_CONTEXT to 'client', then we know we're a client. If it's 'server,' we're a server.
  if (process && process.env) {
    // Ok, there's a global process object. Awesome. What's it say about the context?
    switch (process.env.BLVD_CONTEXT) {
      case 'client': return ContextType.CLIENT
      case 'server': return ContextType.SERVER
      default: break // If BLVD_CONTEXT isn't defined, just skip to the next attempt to try to find the context.
    }
    // (We could claim we're on a server if the process variable exists and doesn't define process.env.BLVD_CONTEXT, but this might break
    // testing so we just try to find a window object instead. Not sure if this is best course of action necessarily but it makes the most
    // sense to me.)
  }

  // If the above doesn't work, we assume we're a client if the window object exists.
  // This isn't foolproof if some dumb dumb puts a global window object on a nodejs server, but it's better than nothing.
  return typeof window !== 'undefined' ? ContextType.CLIENT : ContextType.SERVER
}

export const getContext = async (): Promise<Context> => ({ type: getContextType(), id: await determineId() })
