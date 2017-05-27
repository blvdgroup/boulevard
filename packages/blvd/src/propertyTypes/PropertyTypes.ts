import { Status } from 'blvd-utils'

import PropertyType from './PropertyType'

const prefix = 'I tried to create a new model, but one of the properties was of the incorrect type.'

/**
 * I wrote a bunch of stuff here but it's aaaall very wrong now so I have deleted what was written here.
 */
class PropertyTypes {
  public static string: PropertyType = (o: any, k: string) => typeof o === 'string'
    ? { status: Status.SUCCESS }
    : { status: Status.FAILURE, error: prefix + `${k} was supposed to be a string, but was a ${typeof o} instead.` }
  public static number: PropertyType = (o: any, k: string) => typeof o === 'number'
    ? { status: Status.SUCCESS }
    : { status: Status.FAILURE, error: prefix + `${k} was supposed to be a number, but was a ${typeof o} instead.` }
  public static boolean: PropertyType = (o: any, k: string) => typeof o === 'boolean'
    ? { status: Status.SUCCESS }
    : { status: Status.FAILURE, error: prefix + `${k} was supposed to be a boolean, but was a ${typeof o} instead.` }
  public static required: PropertyType = (o: any, k: string) => typeof o !== 'undefined'
    ? { status: Status.SUCCESS }
    : { status: Status.FAILURE, error: prefix + `${k} was supposed to be defined, but wasn't.` }
}

export default PropertyTypes
