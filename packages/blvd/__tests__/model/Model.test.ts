import { Model, PropertyTypes } from '../../src'
import { ModelPropertiesObject } from '../../src/model/Model'

class Car extends Model {
  public static propertyTypes: object = {
    ...Model.propertyTypes,
    name: PropertyTypes.string,
    year: PropertyTypes.number,
    inStock: PropertyTypes.boolean
  }

  constructor (props: ModelPropertiesObject) {
    super(props)
  }
}

describe('Model', () => {
  it('creates the model properly', () => {
    let lamborghiniHuracan: Car

    Car.make({
      name: 'Lamborghini Huracán',
      year: 2014,
      inStock: true
    }).then((res: Car) => {
      lamborghiniHuracan = res
    }).catch((err: any) => { console.error(err) })
    expect(lamborghiniHuracan).toBeInstanceOf(Car)
  })
  it('has the correct properties', () => {
    let lamborghiniHuracan: Car

    Car.make({
      name: 'Lamborghini Huracán',
      year: 2014,
      inStock: true
    }).then((res: Car) => {
      lamborghiniHuracan = res
    }).catch((err: any) => { console.error(err) })
    expect(lamborghiniHuracan.properties.name).toBe('Lamborghini Huracán')
    expect(lamborghiniHuracan.properties.year).toBe(2014)
    expect(lamborghiniHuracan.properties.inStock).toBe(true)
  })
})
