declare var console

import { randomBytes } from 'crypto'

import Context from './context/Context'
import Model from './model/Model'
import PropertyTypes from './propertyTypes/PropertyTypes'

/**
 * By default, we export the model with a unique, indexable id added on. It is a
 * very bad idea to override this id, and so we don't let you import the Model.
 */
class BaseModel extends Model {
  public static properties: object = {
    id: [PropertyTypes.string(), PropertyTypes.unique('id')]
  }

  constructor (context: Context, properties: object = {}) {
    // Generate an ID for this Item
    const rb = randomBytes(32)
    const newProperties = {
      ...properties,
      id: rb.toString('hex')
    } // TODO
    super(context, newProperties)
  }
}

export { BaseModel as Model, PropertyTypes }
