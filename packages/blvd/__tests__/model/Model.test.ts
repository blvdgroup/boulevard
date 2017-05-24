import { Model, PropertyTypes } from '../../src'
import { ModelPropertiesObject } from '../../src/model/Model'

class Car extends Model {
  public static propertyTypes: object = {
    ...Model.propertyTypes,
    name: PropertyTypes.string,
    year: PropertyTypes.number,
    inStock: PropertyTypes.boolean
  }

  constructor(props: ModelPropertiesObject) {
    super(props)
  }
}

describe('Model', () => {
  const lamborghini = Car.make({
    name: 'Lamborghini Huracán',
    year: 2014,
    inStock: true
  })

  it('creates the model properly', async () => {
    expect.assertions(1)
    expect(await lamborghini).toBeInstanceOf(Car)
  })

  it('has an id which is a string', async () => {
    expect.assertions(1)
    expect((await lamborghini).properties.id).toBeDefined()
  })

  it('has the correct properties', async () => {
    expect.assertions(3)
    expect((await lamborghini).properties.name).toBe('Lamborghini Huracán')
    expect((await lamborghini).properties.year).toBe(2014)
    expect((await lamborghini).properties.inStock).toBe(true)
  })
})
