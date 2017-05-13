import Model from '../model/Model'
import ModelConstructor from '../model/ModelConstructor'

interface PropertyType {
  <M extends Model>(property: any, item: Model, model: ModelConstructor): (boolean | Promise<boolean>)
}

export default PropertyType
