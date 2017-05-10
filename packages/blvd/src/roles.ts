export interface Role {
  parent: string, // id of parent
  name: string // name of role
}

export type UnlinkedRole = string

export const requireRole = (role: Role): MethodDecorator =>
  (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => ({
    ...descriptor,
    value: (...args: any[]) => {
      if (target.client.hasRole(role)) {
        descriptor.value(...args)
      } else {
        console.log(`Attempted to call ${key} on ${target.constructor.name}, but did not have role ${role}.`)
      }
    }
  })
