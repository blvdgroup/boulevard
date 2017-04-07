import Model from '../model/Model'
import { Result } from 'blvd-utils'

interface ItemCheck {
  (item: Model): Promise<Result>
}

export default ItemCheck
