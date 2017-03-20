import { EventEmitter } from 'events'

import Model from '../model/Model'
import ModelConstructor from '../model/ModelConstructor'

enum Status {
  SUCCESS,
  FAILURE
}

interface AddItemResult {
  status: Status,
  error?: string
}

interface ItemFetcher {
  <M extends Model>(model: ModelConstructor<M>, index: string): Promise<M>
}

interface ItemStorer {
  <M extends Model>(item: M, index: string): Promise<AddItemResult>
}

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

  public async addItem<M extends Model>(item: M): Promise<AddItemResult> {
    this.emit('addItem', item) // For outside programs who want to see when an item is added, we implement EventEmitter

    // Run each item storer in tandem, and when they all complete combine the results into a single success result
    // Note that even if an item storer fails to store an item, it should just complete the promise w/a FAILURE result
    return await Promise.all(this.itemStorers.map((store: ItemStorer) => store(item, item.getIndex())))
      .then((results: AddItemResult[]) => results.reduce(
        (a: AddItemResult, b: AddItemResult) => a.status === Status.SUCCESS && b.status === Status.SUCCESS
          ? ({ status: Status.SUCCESS })
          : ({ status: Status.FAILURE, error: a.error || b.error }),
        { status: Status.SUCCESS }
      ))
  }

  public addModel<M extends Model>(Model: ModelConstructor<M>): void {
    this.emit('addModel', Model)
  }

  protected addItemFetcher(fetcher: ItemFetcher): void {
    this.itemFetchers.push(fetcher)
  }

  protected addItemStorer(storer: ItemStorer): void {
    this.itemStorers.push(storer)
  }
}

export default Context
