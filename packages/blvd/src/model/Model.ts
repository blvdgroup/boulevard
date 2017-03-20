import { randomBytes } from 'crypto-promise'

import Context from '../context/Context'
import PropertyType from '../propertyTypes/PropertyType'
import PropertyTypes from '../propertyTypes/PropertyTypes'

interface ObjectThatMightHaveId {
  id?: string
}

/**
 * The Model class represents a Model in a traffic application. A Model is a
 * class upon which Items are based - essentially, a traffic app has a bunch of
 * Items, which are each based off of Models.
 *
 * A traffic app might have three Ingredients and one Drink. Each individual
 * Ingredient and Drink is an Item, and the concepts of Ingredients and Drinks
 * are defined as Models.
 *
 * The Item class represents an item stored in a context. This item should abide
 * by a Model, and be an instance thereof of a Model or a class based off the
 * Model.
 */
class Model {

  public static properties: object = {
    id: [PropertyTypes.string()]
  }

  constructor(public context: Context, public properties: ObjectThatMightHaveId = {}) {
    // First, generate a unique ID for this Item
    (!properties.id ? this.generateId() : Promise.resolve(properties.id))
      .then((id: string) => {
        // Then, add the ID to the properties of the item if it doesn't have an ID
        this.properties = { ...this.properties, id }
      })
      .then(() => this.checkPropertyTypes(this.constructor.prototype.properties, this.properties))
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

  private async checkPropertyTypes(propertyTypes: object, properties: object): Promise<boolean> {
    // Listen, I know you wanna read this function.
    // I do too.
    const checkResults: boolean[] = await Promise.all(Object.keys(this.properties).map((property: string): Promise<boolean> => {
      if (typeof propertyTypes[property] === 'function') {
        return new Promise((resolve: Function, reject: Function) => {
          const check: PropertyType = propertyTypes[property]
          resolve(check(this.properties[property], this, this.constructor.prototype, this.context))
        })
      } else if (Array.isArray(propertyTypes[property])) {
        const checks: PropertyType[] = propertyTypes[property]
        return Promise.all(checks.map((check: Function): Promise<boolean> =>
          Promise.resolve(check(this.properties[property], this, this.constructor.prototype, this.context))
        )).then((results: boolean[]) => results.reduce(((prev: boolean, curr: boolean) => (prev === true && curr === true)), true))
      }
      return Promise.resolve(false)
    }))
    return checkResults.reduce(((prev: boolean, curr: boolean) => (prev === true && curr === true)), true)
  }

  private async generateId(): Promise<string> {
    const r = await randomBytes(32)
    return r.toString('hex')
  }
}

export default Model
