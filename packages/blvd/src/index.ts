import Model from './model/Model'
import ModelConstructor from './model/ModelConstructor'
import PropertyTypes from './propertyTypes/PropertyTypes'
import { Role, requireRole } from './roles'
import connection from './connection'
import Application from './Application'

import { Result } from 'blvd-utils'

// TODO: Implement getUnderlyingConnection(): require('ws').Connection
// This will be a reference to the underlying websocket connection. I _might_ end up pushing this to the blvd-client package, as the server
// itself will be handling a lot of connections and so this API won't be very clear.

export {
  Model,
  PropertyTypes,
  Role,
  requireRole,
  connection,
  Application,
  ModelConstructor,
  Result
}
