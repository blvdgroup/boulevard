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

  // TODO: Implement public static async getByIndex(index: string, value: any)
  // TODO: Implement public static async getById(id: string)

  constructor(public properties: ObjectThatMightHaveId = {}) {
    // First, generate a unique ID for this Item
    (!properties.id ? this.generateId() : Promise.resolve(properties.id))
      .then((id: string) => {
        // Then, add the ID to the properties of the item if it doesn't have an ID
        this.properties = { ...this.properties, id }
      })
      .then(() => this.checkPropertyTypes(this.constructor.prototype.propertyTypes, this.properties))
      .then(
        // Then, check the properties of the item match up with the propertyTypes provided
        () => {
          console.log('Successfully created new model! Yay!')
        },
        () => {
          console.log('Uh-oh! Something broke when checking the property types!')
        }
      )
  }

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

  private async checkPropertyTypes(propertyTypes: object, properties: object): Promise<Result> {
    const checkResults: Result[] = await Promise.all(Object.keys(this.properties).map((property: string): Promise<Result> => {
      if (typeof propertyTypes[property] === 'function') {
        return new Promise((resolve: Function, reject: Function) => {
          const check: PropertyType = propertyTypes[property]
          resolve(check(this.properties[property], this, this.constructor.prototype))
        })
      } else if (Array.isArray(propertyTypes[property])) {
        const checks: PropertyType[] = propertyTypes[property]
        return Promise.all(checks.map((check: Function): Promise<Result> =>
          Promise.resolve(check(this.properties[property], this, this.constructor.prototype))
        )).then((results: Result[]) => results.reduce(reduceResults, { status: Status.SUCCESS }))
      }
      return Promise.resolve({
        status: Status.FAILURE,
        error: 'One of the provided property types was not a function or array of functions.'
      })
    }))
    return checkResults.reduce(reduceResults, { status: Status.SUCCESS })
  }

  private async generateId(): Promise<string> {
    const r = await randomBytes(32)
    return r.toString('hex')
  }
}

export default Model
