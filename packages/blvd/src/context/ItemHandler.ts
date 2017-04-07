import Model from '../model/Model'
import { Result } from 'blvd-utils'

interface ItemHandler {
  (i: Model): Promise<(void | Result)>
}

export default ItemHandler
