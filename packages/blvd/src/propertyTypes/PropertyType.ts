import Context from '../context/Context'
import Model from '../model/Model'
import ModelConstructor from '../model/ModelConstructor'

interface PropertyType {
  <M extends Model>(property: any, item: Model, model: ModelConstructor<M>, context: Context): (boolean | Promise<boolean>)
}

export default PropertyType
