import Model, { ModelPropertiesObject } from './Model'

interface ModelConstructor {
  propertyTypes: object,
  new(properties: ModelPropertiesObject, ianctd?: boolean): Model,
  make(properties: ModelPropertiesObject): Promise<Model>,
  // getById(id: string): Promise<Model>
}

export default ModelConstructor
