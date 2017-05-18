import { Status } from 'blvd-utils'

import PropertyType from './PropertyType'

/**
 * I wrote a bunch of stuff here but it's aaaall very wrong now so I have deleted what was written here.
 */
class PropertyTypes {
  public static string: PropertyType = (o: any) => typeof o === 'string' ? { status: Status.SUCCESS } : { status: Status.FAILURE }
  public static number: PropertyType = (o: any) => typeof o === 'number' ? { status: Status.SUCCESS } : { status: Status.FAILURE }
  public static boolean: PropertyType = (o: any) => typeof o === 'boolean' ? { status: Status.SUCCESS } : { status: Status.FAILURE }
}

export default PropertyTypes
