import PropertyTypeWrapper from './PropertyTypeWrapper'

/**
 * The PropertyTypes class allows you to check your properties against a variety
 * of predefined properties and pretty easily set unique identities on each
 * property. A PropertyType is really just a function, which returns a function,
 * which is passed a unique set of variables, which should return true if the
 * property is valid and false otherwise.
 *
 * The first part of the PropertyType is to pass arbitrary variables to the
 * PropertyType by the programmer defining the properties. If there are no
 * variables to be passed, you should have an empty function wrapper anyway,
 * for consistency.
 *
 * That function should return another function, which is passed four variables:
 * - First, the property that is to be checked. Usually the only variable used,
 *   except for some special properties.
 * - Second, the Item the property is a property of.
 * - Third, the Model the Item is an item of.
 * - Fourth, the context (session or global) the Item is a member of.
 *
 * This function should true, false, or a promise which eventually resolves to
 * true or false. Anything other than true or false is considered an error.
 */
class PropertyTypes {
  public static string: PropertyTypeWrapper = () => (o: any) => typeof o === 'string'
  public static number: PropertyTypeWrapper = () => (o: any) => typeof o === 'number'
  public static boolean: PropertyTypeWrapper = () => (o: any) => typeof o === 'boolean'
}

export default PropertyTypes
