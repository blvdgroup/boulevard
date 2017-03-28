import { Result } from 'blvd-utils'
import Model from '../model/Model'

interface ItemStorer {
  <M extends Model>(item: M, index: string): Promise<Result>
}

export default ItemStorer
