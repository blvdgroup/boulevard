import { randomBytes } from 'crypto-promise'
import * as log from 'loglevel'

import { Status, Result, reduceResults } from 'blvd-utils'

import PropertyType from '../propertyTypes/PropertyType'
import PropertyTypes from '../propertyTypes/PropertyTypes'
import { Role, UnlinkedRole, requireRole as rr } from '../roles'
import ModelConstructor from './ModelConstructor'
import { Context, ContextType, getContext, getContextType } from '../context'
import connection from '../connection'

// The Model represents a type of Item which may exist in a boulevard server. It specifies
// what properties the item might have, what each Item matching this Model does upon creation,
// and other stuff like that.
//
// Every Item, regardless of which Model it is based off, has a unique id which identifies it
// to the server. This is generated in this base class. Please don't override it, because that
// would be bad.

export interface FuncIdStorage {
  [index: string]: string
}

// Properties for a Model. You can extend this interface to include anything[1] you want.
//
// [1]: https://www.youtube.com/watch?v=6ExVBVonRKQ
export interface ModelPropertiesObject {
  [key: string]: any;
}

abstract class Model {
  public static roles: Role[] = []

  private static inherentProps: object = {
    id: PropertyTypes.string
  }

  public properties: ModelPropertiesObject = {}

  protected context: Context

  private construction: Promise<Result>

  private tossedFunctions: FuncIdStorage

  // TODO: the latest `makeInternal()` changes breaks this method. Rethink of a way this would work.
  // public static async getById(id: string): Promise<Model> {
  //   return (this.makeInternal(id) as Promise<Model>)
  // }

  public static async make(properties: ModelPropertiesObject, requestingClient?: string): Promise<Model> {
    // The make function takes several steps before it actually creates the model

    // First we run through the props and ensure they are all valid.
    // We're gonna end up doing this again on the server, but checking here before we do means we can fail early and save time.
    const propChecks = { ...((this.prototype.constructor as any).props || {}), ...Model.inherentProps }
    const propCheckResult = await this.checkProps(propChecks, properties)
    if (propCheckResult.status === Status.FAILURE) throw new Error(propCheckResult.error)

    // Now that the properties passed are validated let's check if we're on the server or the client.
    const contextType = getContextType()
    const client = contextType === ContextType.CLIENT

    // If we're a client, we request that the server make a new item with the given properties.
    if (client) {
      const c = await connection.requestConnection()
      // TODO: Send request to create item
      // TODO: Handle response to create item, both in failing + success scenarios
    } else if (contextType === ContextType.SERVER) {
      // We are the server, so just make the item
      const item = this.makeInternal(properties)
      // TODO: Emit item ID to requestingClient so that those waiting for the item will know
      return item
    }

    throw new Error('Attempted to make thing, but got here for some reason.')
  }

  private static async makeInternal(properties: ModelPropertiesObject): Promise<Model> {
    log.debug('Making and/or fetching a new Item the right way...')
    // now this is thinking with portals
    const model: Model =
      new (this.prototype.constructor as ModelConstructor)(properties, true)
    const result = await model.construction
    switch (result.status) {
      case Status.SUCCESS: return model
      case Status.FAILURE: log.error('Construction on model failed'); throw new Error(result.error)
      default: throw new Error('I have no idea how this error would get thrown. There has been a terrible, awful mistake.')
    }
  }

  private static async checkProps(propChecks: object, props: object): Promise<Result> {
    log.debug('Checking property types...')

    // First, we create an array of results by creating an array of promises (one per property) and waiting on all of them.
    const checkResults: Result[] = await Promise.all(Object.keys(props).map((property: string): Promise<Result> => {
      log.debug(`Mapping property ${property}...`)
      if (typeof propChecks[property] === 'function') {
        log.debug(`${property} propType is a function, so we're gonna check that.`)
        // If the property type of the property we're checking is a function, we run the function and return the result.
        return Promise.resolve((propChecks[property] as PropertyType)(props[property], property))
      } else if (Array.isArray(propChecks[property])) {
        log.debug(`${property} propType is an array of functions, so we're gonna check those.`)
        // If the property type of the property we're checking is an array, we assume it is an array of functions and run each function
        // before reducing all these results into one result.
        const checks: PropertyType[] = propChecks[property]
        return Promise.all(checks.map((check: PropertyType): Promise<Result> =>
          Promise.resolve(check(props[property], property))
        )).then((results: Result[]) => results.reduce(reduceResults, { status: Status.SUCCESS }))
      }

      // If the property type is neither a function nor an array of functions, we return a failing status because you gave a bad property
      // type.
      return Promise.resolve({
        status: Status.FAILURE,
        error: 'One of the provided property types was not a function or array of functions.'
      })
    }))

    log.debug(checkResults)

    // We then reduce all the results into a single result object.
    return checkResults.reduce(reduceResults, { status: Status.SUCCESS })
  }


  // TODO: Implement public static async getByIndex(index: string, value: any)

  constructor(properties: ModelPropertiesObject = {}, iAmNotCallingThisDirectly: boolean = false) {
    // A quick note:
    // This should NOT be called directly (i.e. should NOT be called using new Model(), or even new ClassExtendingModel()). This is because
    // models are built ASYNCHRONOUSLY! If you call new Model(), the next line of code cannot know if the model is finished building and
    // populating. To get around this, we use the static methods `make` and `getById`, which will return promises that return a completed,
    // populated model.
    if (!!iAmNotCallingThisDirectly) {
      log.error('You FOOL! You absolute SCOUNDREL! You did not HEED THE WARNING of the DOCUMENTATION SCROLL!')
      log.error('You have created a worthless and unpopulated Item, for you did not allow construction to commence!')
      log.error('You must NOT create an Item through the new Model() constructor! Use the Model.make() or Model.getById() functions!')
      log.error('Bah!')
      throw new Error('Read the documentation scroll and dont use new Model()!')
    }

    // TODO: This construction promise will also have a step where it contacts the server to ask for the properties of this item (if the id
    // exists.) This will probably take up the majority of the "construction" time. Again, this is why we use `make` or `getById`.
    log.debug('Beginning construction on a new Item instance...')
    this.construction = (!properties.id ? this.generateId() : Promise.resolve(properties.id))
      .then((id: string) => {
        // Then, add the ID to the properties of the item if it doesn't have an ID
        this.properties = { ...properties, id }
      })
      .then(() => this.getModelContext())
      .then(() => { log.debug(this.properties); return { status: Status.SUCCESS } })
  }

  // TODO: Implement protected async useSecretProperty(property: string, func: (propertyValue: any) => any): Promise<Result>

  // This is a decorator you can use on your class functions to ensure the functions are only used of the client has certain roles.
  public requireRole(role: UnlinkedRole): MethodDecorator { return rr(this.getRole(role)) }

  public getRole(role: UnlinkedRole): Role {
    const roles = this.constructor.prototype.roles

    if (roles.filter((a: UnlinkedRole) => a === role)) {
      return {
        name: role,
        parent: this.properties.id
      }
    } else {
      throw new Error(`Attempted to get role ${role} from a ${this.constructor.name}, but we don't got have that role.`)
    }
  }

  public async toss(f: (context: Context, ...args: any[]) => Promise<any>, context?: Context): Promise<any> {
    if (!this.tossedFunctions[this.hexString(f.toString()).slice(0, 32)]) {
      throw new Error('Attempted to run tossed function, but tossed function does not appear to be registered.')
    }
    if (this.context.type === ContextType.SERVER) {
      return await f(context || this.context)
    } else {
      // TODO
      // return await this.app.handleToss(this.constructor.prototype, this.hexString(f.toString()).slice(0, 32))
    }
  }

  public registerTossedFunction(key: string): void {
    if (typeof this[key] !== 'function') throw new Error(`Attempted to register tossed function ${key}, but it's not a function.`)
    this.tossedFunctions[this.hexString(this[key].toString()).slice(0, 32)] = key
  }

  // TODO: Consider swapping out home grown property types for using React `prop-types`?
  
  // Really simple way to generate an id for an object.
  // TODO: This should probably be tossed to a server.
  private async generateId(): Promise<string> {
    const r = await randomBytes(32)
    return r.toString('hex')
  }

  private async getModelContext(): Promise<Result> {
    log.debug('Getting model context...')
    this.context = await getContext()
    return { status: Status.SUCCESS }
  }

  // cast an ancient curse on a string and banish it to another realm
  private hexString(str: string): string {
    let result = ''
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16)
    }
    return result
  }
}

export default Model
