import { randomBytes } from 'crypto-promise'

import { Status, Result, reduceResults } from 'blvd-utils'
import PropertyType from '../propertyTypes/PropertyType'
import PropertyTypes from '../propertyTypes/PropertyTypes'

export interface ObjectThatMightHaveId {
  id?: string
}

// The Model represents a type of Item which may exist in a boulevard server. It specifies
// what properties the item might have, what each Item matching this Model does upon creation,
// and other stuff like that.
//
// Every Item, regardless of which Model it is based off, has a unique id which identifies it
// to the server. This is generated in this base class. Please don't override it, because that
// would be bad.
abstract class Model {

  public static propertyTypes: object = {
    id: [PropertyTypes.string]
  }

  // TODO: Implement public static async getById(id: string)
  // This should be implemented first, before we start to implement indexes. I also need to outline how DB adapters are gonna work.

  // TODO: Implement public static async getByIndex(index: string, value: any)

  constructor(public properties: ObjectThatMightHaveId = {}) {
    // First, generate a unique ID for this Item
    (!properties.id ? this.generateId() : Promise.resolve(properties.id))
      .then((id: string) => {
        // Then, add the ID to the properties of the item if it doesn't have an ID
        this.properties = { ...this.properties, id }
      })
      .then(() => this.checkPropertyTypes(this.constructor.prototype.propertyTypes, this.properties))
  }

  // TODO: I need to clarify in my mind how indexes work...
  public getIndex(): string {
    if (typeof this.properties.id === 'string') {
      return this.properties.id
    } else {
      throw new Error('Attempted to fetch index of object before index was declared.')
    }
  }

  // TODO: Implement protected async toss(func: () => void): Promise<Result>
  // Also consider implementing as decorator?

  // TODO: Implement protected async useSecretProperty(property: string, func: (propertyValue: any) => any): Promise<Result>

  // TODO: Implement protected requireRole(role: Role): (target: any, key: string, descriptor: PropertyDescriptor): void
  // This will just be a wrapper around the requireRole provided by the main blvd package, making it slightly easier by allowing you to
  // just pass the original role object for clearer syntax, e.g.,
  // @this.requireRole('GOOD_BOY') === @requireRole(this.roles.GOOD_BOY) === @requireRole(DogModel.getById(this.id).roles.GOOD_BOY)

  // TODO: Consider swapping out home grown property types for using React `prop-types`?
  private async checkPropertyTypes(propertyTypes: object, properties: object): Promise<Result> {
    // First, we create an array of results by creating an array of promises (one per property) and waiting on all of them.
    const checkResults: Result[] = await Promise.all(Object.keys(this.properties).map((property: string): Promise<Result> => {
      if (typeof propertyTypes[property] === 'function') {
        // If the property type of the property we're checking is a function, we run the function and return the result.
        return new Promise((resolve: Function, reject: Function) => {
          const check: PropertyType = propertyTypes[property]
          resolve(check(this.properties[property], this, this.constructor.prototype))
        })
      } else if (Array.isArray(propertyTypes[property])) {
        // If the property type of the property we're checking is an array, we assume it is an array of functions and run each function
        // before reducing all these results into one result.
        const checks: PropertyType[] = propertyTypes[property]
        return Promise.all(checks.map((check: Function): Promise<Result> =>
          Promise.resolve(check(this.properties[property], this, this.constructor.prototype))
        )).then((results: Result[]) => results.reduce(reduceResults, { status: Status.SUCCESS }))
      }
      // If the property type is neither a function nor an array of functions, we return a failing status because you gave a bad property
      // type.
      return Promise.resolve({
        status: Status.FAILURE,
        error: 'One of the provided property types was not a function or array of functions.'
      })
    }))

    // We then reduce all the results into a single result object.
    return checkResults.reduce(reduceResults, { status: Status.SUCCESS })
  }

  // Really simple way to generate an id for an object.
  // TODO: This should probably be tossed to a server.
  private async generateId(): Promise<string> {
    const r = await randomBytes(32)
    return r.toString('hex')
  }
}

export default Model
