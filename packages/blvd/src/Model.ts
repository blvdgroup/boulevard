import Context from './Context'
import PropertyType from './PropertyType'

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

  public static properties: object = {}

  constructor(public context: Context, public properties: object = {}) {
    if (!this.checkPropertyTypes()) throw new Error('Somethings has gone horribly awry!')
  }

  private async checkPropertyTypes(): Promise<boolean> {
    // Listen, I know you wanna read this function.
    // I do too.
    const propertyTypes = this.constructor.prototype.properties
    const checkResults: boolean[] = await Promise.all(Object.keys(this.properties).map((property): Promise<boolean> => {
      if (typeof propertyTypes[property] === 'function') {
        return new Promise((resolve: Function, reject: Function) => {
          const check: PropertyType = propertyTypes[property]
          resolve(check(this.properties[property], this, this.constructor.prototype, this.context))
        })
      } else if (Array.isArray(propertyTypes[property])) {
        const checks: PropertyType[] = propertyTypes[property]
        return Promise.all(checks.map((check: Function): Promise<boolean> => new Promise((resolve: Function, reject: Function) => {
          resolve(check(this.properties[property], this, this.constructor.prototype, this.context))
        }))).then((results: boolean[]) => results.reduce(((prev: boolean, curr: boolean) => (prev === true && curr === true)), true))
      }
      return new Promise((resolve: Function, reject: Function) => resolve(false))
    }))
    return checkResults.reduce(((prev: boolean, curr: boolean) => (prev === true && curr === true)), true)
  }
}

export default Model
