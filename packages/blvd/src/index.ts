declare var console

import Context from './Context'
import Model from './Model'
import PropertyTypes from './PropertyTypes'

/**
 * By default, we export the model with a unique, indexable id added on. It is a
 * very bad idea to override this id, and so we don't let you import the Model.
 */
class BaseModel extends Model {
  public static properties: object = {
    id: [PropertyTypes.string(), PropertyTypes.index('id')]
  }

  constructor (context: Context, properties: object = {}) {
    // Generate an ID for this Item
    const newProperties = { ...properties, id: 'TheoreticallyRandomID' } // TODO
    super(context, newProperties)
  }
}

export { BaseModel as Model, PropertyTypes }
