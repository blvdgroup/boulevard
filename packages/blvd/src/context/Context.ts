import { EventEmitter } from 'events'

import ItemFetcher from './ItemFetcher'
import ItemStorer from './ItemStorer'

import { Status, Result, reduceResults } from 'blvd-utils'
import Model from '../model/Model'
import ModelConstructor from '../model/ModelConstructor'

/**
 * A context is an area where Items are stored. A traffic application has two
 * contexts - you can either be referring to the session context, which is
 * shared between server and client but only per session, or the global context,
 * which is shared between all sessions connected to a server. Each context
 * allows you to fetch and store items in the context, although in the global
 * context you can't by default (for good reason), along with some other stuff
 * I've yet to define.
 */
class Context extends EventEmitter {
  public models: Array<ModelConstructor<any>> = []
  protected itemFetchers: ItemFetcher[] = []
  protected itemStorers: ItemStorer[] = []

  public async item<M extends Model>(ItemModel: ModelConstructor<M>, index: string): Promise<M> {
    // TODO: This is just a dummy method - Should actually attempt to fetch an item.
    return new Promise<M>((resolve: Function, reject: Function) => (new ItemModel(this)))
  }

  // TODO: items method, for fetching multiple items

  public async addItem<M extends Model>(item: M): Promise<Result> {
    this.emit('addItem', item) // For outside programs who want to see when an item is added, we implement EventEmitter

    // Run each item storer in tandem, and when they all complete combine the results into a single success result
    // Note that even if an item storer fails to store an item, it should just complete the promise w/a FAILURE result
    return await Promise.all(this.itemStorers.map((store: ItemStorer) => store(item, item.getIndex())))
      .then((results: Result[]) => results.reduce(reduceResults, { status: Status.SUCCESS }))
  }

  public addModel<M extends Model>(MToAdd: ModelConstructor<M>): void {
    this.emit('addModel', MToAdd)
    this.models.push(MToAdd)
  }

  protected addItemFetcher(fetcher: ItemFetcher): void {
    this.itemFetchers.push(fetcher)
  }

  protected addItemStorer(storer: ItemStorer): void {
    this.itemStorers.push(storer)
  }
}

export default Context
