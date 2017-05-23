import { Model, PropertyTypes } from '../../src'

class Car extends Model {
  public static propertyTypes: object = {
    ...Model.propertyTypes,
    name: PropertyTypes.string,
    year: PropertyTypes.number,
    inStock: PropertyTypes.boolean
  }

  constructor (...props) {
    super(...props)
  }
}

const lamborghiniHuracan = Car.make({
  name: 'Lamborghini Huracan',
  year: 2014,
  inStock: true
})

describe('Model', () => {
  it('creates the model properly', () => {
    expect(true).toBe(true)
  })
})
