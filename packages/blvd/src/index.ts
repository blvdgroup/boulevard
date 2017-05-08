import Model from './model/Model'
import PropertyTypes from './propertyTypes/PropertyTypes'

// TODO: Implement getUnderlyingConnection(): require('ws').Connection
// This will be a reference to the underlying websocket connection. I _might_ end up pushing this to the blvd-client package, as the server
// itself will be handling a lot of connections and so this API won't be very clear.

// TODO: Implement requireRole(role: Role): (target: any, key: string, descriptor: PropertyDescriptor): void
// This is a simple check that ensures the current client has the role required. This _needs_ to be on the main package, as it's a crucial
// part of models.

export { Model, PropertyTypes }
