import { Context, Model } from 'blvd'

interface Persistor {
  persist: <M extends Model>(item: M) => Promise<boolean>
}

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
    this.addItemStorer(<M extends Model>(item: M) => this.persist(item))
  }

  public addPersistor(persistor: Persistor): void {
    this.persistors.push(persistor)
  }

  private async persist<M extends Model>(item: M): Promise<boolean> {
    return (await Promise.all(this.persistors.map((p: Persistor) => p.persist(item))))
      .reduce(((prev: boolean, curr: boolean) => (prev === true && curr === true)), true)
  }

  // TODO: fetch function
  // TODO: handle errors better than reducing to boolean
}
