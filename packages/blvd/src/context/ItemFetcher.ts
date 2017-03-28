import Model from '../model/Model'
import ModelConstructor from '../model/ModelConstructor'

interface ItemFetcher {
  <M extends Model>(model: ModelConstructor<M>, index: string): Promise<M>
}

export default ItemFetcher
