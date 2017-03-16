import Model from '../model/Model'
import ModelConstructor from '../model/ModelConstructor'

interface ItemListener {
  <M extends Model>(item: M): Promise<boolean>
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
class Context {
  protected addItemListeners: ItemListener[] = []

  public async item<M extends Model>(ItemModel: ModelConstructor<M>, index: object): Promise<M> {
    // TODO: This is just a dummy method - Should actually attempt to fetch an item.
    return new Promise<M>((resolve: Function, reject: Function) => (new ItemModel(this)))
  }

  // TODO: items method, for fetching multiple items

  public async addItem<M extends Model>(ItemModel: ModelConstructor<M>, properties?: object): Promise<boolean> {
    // When you add an item, simply run all the addItemListeners in tandem and wait for them all to complete.
    // They should return true in case of a success, and false in case of a failure. We then reduce this array
    // of booleans to a single true or false result.
    //
    // By default, we don't have any addItem listeners in a context, but both the ServerContext and SessionContext
    // append some addItemListeners to handle addition of an item. A SessionContext will attempt to store the item
    // in JS, and a ServerContext will attempt to store the item based on what Persistors it has been assigned.
    //
    // Defining your own contexts (which can be useful in a variety of situations) allows you to more granularly
    // define exactly what should happen when an item is added to the context.
    //
    // TODO: Handle errors better than reducing everything to a boolean, lol
    return await Promise.all(this.addItemListeners.map((l: ItemListener) => l(new ItemModel(this, properties))))
      .then((results: boolean[]) => results.reduce(((prev: boolean, curr: boolean) => (prev === true && curr === true)), true))
  }
}

export default Context
