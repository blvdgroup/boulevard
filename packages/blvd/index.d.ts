declare module blvd {
  export enum Status {
    SUCCESS,
    FAILURE
  }

  export interface Result {
    status: Status,
    error?: string
  }

  interface ItemFetcher {
    <M extends Model>(model: ModelConstructor<M>, index: string): Promise<M>
  }
  

  interface ItemStorer {
    <M extends Model>(item: M, index: string): Promise<Result>
  }

  interface ModelConstructor<M extends Model> {
    new (context: Context, properties?: object): M
  }

  interface PropertyType {
    <M extends Model>(property: any, item: Model, model: ModelConstructor<M>, context: Context): (boolean | Promise<boolean>)
  }

  export class Context {
    models: Array<ModelConstructor<any>>
    itemFetchers: ItemFetcher[]
    itemStorers: ItemStorer[]

    item <M extends Model>(ItemModel: ModelConstructor<M>, index: string): Promise<M>
    addItem <M extends Model>(item: M): Promise<Result>
    addModel <M extends Model>(MToAdd: ModelConstructor<M>): void
    addItemFetcher (fetcher: ItemFetcher): void
    addItemStorer (storer: ItemStorer): void
  }

  export class Model {
    static properties: object

    new (context: Context, properties: object): Model
    getIndex (): string
    checkPropertyTypes (propertyTypes: object, properties: object): Promise<Result>
    generateId(): Promise<string>
  }

  export class PropertyTypes {
    static string: PropertyType
    static boolean: PropertyType
    static number: PropertyType
  }
}
