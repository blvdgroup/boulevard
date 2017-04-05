import { Context, Model } from 'blvd'
import { Result, Status, reduceResults } from 'blvd-utils'

import Persistor from './Persistor'

/**
 * A ServerContext is a context meant to be run on a server, which implements the
 * concept of Persistors, and when an item is added it's passed to each Persistor.
 * Fetching an item passes the fetch to each persistor, and the first persistor to
 * return a value will be the value passed. This way, you can stack persistors
 * atop one another in the same ServerContext, say, a cache persistor and a LTS
 * persistor, and if the cache persistor can't come up with anything the LTS
 * persistor eventually will.
 */
class ServerContext extends Context {
  protected persistors: Persistor[] = []

  constructor () {
    super()
    this.addItemStorer(<M extends Model>(item: M, index: string) => this.persist(item, index))
  }

  public addPersistor(persistor: Persistor): void {
    this.persistors.push(persistor)
  }

  private async persist<M extends Model>(item: M, index: string): Promise<Result> {
    return (await Promise.all(this.persistors.map((p: Persistor) => p.persist(item, index))))
      .reduce(reduceResults, { status: Status.SUCCESS })
  }

  // TODO: fetch function
  // TODO: handle errors better than reducing to boolean
}

export default ServerContext
