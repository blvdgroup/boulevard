import { Model } from 'blvd'
import { Result } from 'blvd-utils'

interface Persistor {
  persist: <M extends Model>(item: M, index: string) => Promise<Result>
}

export default Persistor
