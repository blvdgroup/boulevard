import { Result } from 'blvd-utils'

type PropertyType = (property: any, key: string) => (Result | Promise<Result>)

export default PropertyType
