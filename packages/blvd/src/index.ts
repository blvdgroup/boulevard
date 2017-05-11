import Model from './model/Model'
import PropertyTypes from './propertyTypes/PropertyTypes'
import { Role, requireRole } from './roles'
import connection from './connection'

// TODO: Implement getUnderlyingConnection(): require('ws').Connection
// This will be a reference to the underlying websocket connection. I _might_ end up pushing this to the blvd-client package, as the server
// itself will be handling a lot of connections and so this API won't be very clear.

export { Model, PropertyTypes, Role, requireRole, connection }
