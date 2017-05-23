import { Context } from './context'

const toss = (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
  if (!target.registerTossedFunction) {
    throw new Error('Attempted to register tossed function using decorator, but target does not appear to be a Model.')
  }
  target.registerTossedFunction(key)
  return ({
    ...descriptor,
    value: (...args: any[]) => {
      target.toss((context: Context) => descriptor.value(context, ...args))
    }
  })
}

export default toss
