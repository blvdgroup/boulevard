import Model from './Model'
import ModelConstructor from './ModelConstructor'

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
  public async item<M extends Model>(ItemModel: ModelConstructor<M>, index: any): Promise<M> {
    // TODO: This is just a dummy method - Should actually attempt to fetch an item.
    return new Promise<M>((resolve: Function, reject: Function) => (new ItemModel(this)))
  }

  // TODO: items method, for fetching multiple items
}

export default Context
