import Context from './Context'
import Model from './Model'
import ModelConstructor from './ModelConstructor'

interface PropertyType {
  <M extends Model>(property: any, item: Model, model: ModelConstructor<M>, context: Context): (boolean | Promise<boolean>)
}

export default PropertyType
