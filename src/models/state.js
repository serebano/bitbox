import Model from '../model/create'
import Path from '../model/path'
import handler from './state.handler'
import PathFactory from '../model/PathFactory'

export default (target, store) => new Model(target, handler, PathFactory('state', store))
