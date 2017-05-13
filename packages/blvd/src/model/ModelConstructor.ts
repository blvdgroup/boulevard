import Model from './Model'

interface ModelConstructor {
  propertyTypes: object,
  new (properties?: object, ianctd?: boolean): Model,
  make (): Promise<Model>,
  getById(id: string): Promise<Model>
}

export default ModelConstructor
