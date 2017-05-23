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
    expect(await lamborghini).toBeInstanceOf(Car)
  })

  it('has the correct properties', async () => {
    expect((await lamborghini).properties.name).toBe('Lamborghini Huracán')
    expect((await lamborghini).properties.year).toBe(2014)
    expect((await lamborghini).properties.inStock).toBe(true)
  })
})
