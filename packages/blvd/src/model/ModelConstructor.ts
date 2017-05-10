import Model from './Model'

interface ModelConstructor<M extends Model> {
  new (properties?: object): M
}

export default ModelConstructor
