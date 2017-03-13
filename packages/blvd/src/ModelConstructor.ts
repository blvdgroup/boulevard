import Context from './Context'
import Model from './Model'

interface ModelConstructor<M extends Model> {
  new (context: Context, properties?: object): M
}

export default ModelConstructor
