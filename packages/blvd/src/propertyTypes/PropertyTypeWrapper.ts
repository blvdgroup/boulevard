import PropertyType from './PropertyType'

interface PropertyTypeWrapper {
  (args?: any): PropertyType
}

export default PropertyTypeWrapper
