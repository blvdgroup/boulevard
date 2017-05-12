import Model from './Model'

interface ModelConstructor {
  new (properties?: object, ianctd?: boolean): Model
}

export default ModelConstructor
