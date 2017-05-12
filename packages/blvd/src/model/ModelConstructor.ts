import Model from './Model'

interface ModelConstructor<M extends Model> {
  new (properties?: object, ianctd?: boolean): M
}

export default ModelConstructor
