import Model from '../model/Model'
import ModelConstructor from '../model/ModelConstructor'

import { Result } from 'blvd-utils'

type PropertyType = (property: any, item?: Model, model?: ModelConstructor) => (Result | Promise<Result>)

export default PropertyType
