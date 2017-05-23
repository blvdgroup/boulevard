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

const makeSampleModel = () => {
  return Car.make({
    name: 'Lamborghini Huracán',
    year: 2014,
    inStock: true
  })
}

describe('Model', () => {
  let data: Car = null

  beforeAll(() => makeSampleModel().then((res: Car) => {
    data = res
  }))

  it('creates the model properly', () => {
    expect(data).toBeInstanceOf(Car)
  })

  it('has the correct properties', () => {
    expect(data.properties.name).toBe('Lamborghini Huracán')
    expect(data.properties.year).toBe(2014)
    expect(data.properties.inStock).toBe(true)
  })
})
