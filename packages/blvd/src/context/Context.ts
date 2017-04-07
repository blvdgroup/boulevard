import { Result, Status, reduceResults } from 'blvd-utils'

import Model from '../model/Model'
import ItemCheck from './ItemCheck'
import ItemHandler from './ItemHandler'

// The important thing to note about a context is it controls the communication between
// a number of clients and the server. This makes it different from a model, which just
// stores information - a context controls the distribution of information across multiple
// devices.
//
// There are two different types of context you'll be dealing with, and both extend this base
// class. PersistentContexts exist between sessions, and are used primarily to store info
// about models long-term. SessionContexts exist between a client and a server, and are used
// to echo information between the two. These both exist in the blvd-server package.
//
// Previously items existed "within" a single context, but I've come to realize this is not
// the main feature of a context. An item exists within a server, identified by a unique id -
// however, it can be added to a context to trigger whatever the context deems fit. If you have
// an item, for example, and you need to store it in the redis database, you add it to the
// RedisContext to have it stored. If you have a new item on the server and you want to send it
// to all of the other connected clients, you put it in some sort of GlobalContext.
//
// A context can also "conjure" and "disappear" items. If an item "disappears," it is removed
// from memory and cannot be immediately accessed. The bouelvard server, for all intents and
// purposes, does not know the item exists. However, the server can then ask a Context to "conjure"
// an item, if it suspects a model with a given id exists but does not know the properties of
// the item. This is largely seen at work in PersistentContexts, which "disappear" items not
// currently in use to a database but are then able to "conjure" them when asked.
//
// The server may also make queries over all items (including disappeared ones) to a context, such
// as "all items with [x] property greater than [y]," and the context should be able to transform
// this into a database query. Again, mostly seen in PersistentContexts dealing with databases.
//
// Another thing a Context can do is allow certain roles to add or remove Items from the Context.
// For example, we don't want a client to be able to add just whatever they want to the server,
// so we place them in two contexts - one where only the server can add and the client can read,
// and one that both the server and client can add to but only allows certain models to be added.
abstract class Context {
  public items: Model[] = []

  private itemChecks: ItemCheck[] = [
    // We have one item check built in which ensures no duplicate items are passed to the context.
    (i: Model) => Promise.resolve(
      this.items.filter((t: Model) => t.getIndex() !== i.getIndex()).length === 0
        ? { status: Status.SUCCESS }
        : { status: Status.FAILURE, error: 'Duplicate item passed to context.' }
    )
  ]

  private itemHandlers: ItemHandler[] = []


  public async addItem(item: Model): Promise<Result> {
    // First, we run each of the item checks we've assigned to this context to make sure we can add this item.
    // They're all async, so we create an array of promises and await an array of Results.
    const checkResultA = await Promise.all(this.itemChecks.map((check: ItemCheck) => check(item)))

    // Then, we reduce it to a single result.
    const checkResult = checkResultA.reduce(reduceResults, { status: Status.SUCCESS })

    // If we failed, return the failure result.
    if (checkResult.status !== Status.SUCCESS) return checkResult

    // Otherwise, let's let the item handlers handle it, but not care about their result.
    this.itemHandlers.forEach((handler: ItemHandler) => { handler(item) })

    // Add the item to our locally stored list of items and return a success result.
    this.items.push(item)
    return { status: Status.SUCCESS }
  }

  protected addItemCheck(i: ItemCheck): void {
    this.itemChecks.push(i)
  }

  protected addItemHandler(i: ItemHandler): void {
    this.itemHandlers.push(i)
  }
}

export default Context
