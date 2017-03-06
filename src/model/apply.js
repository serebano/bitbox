import Path from './path'
import {isComplexObject} from '../utils'

function apply(target, path, method, ...args) {
    let change = null;

    Path.keys(path).reduce((target, key, index, keys) => {
        if (index === keys.length - 1) {
            const state = target[key]
            const result = method(target, key, ...args)

            if (state !== target[key] || (isComplexObject(target[key]) && isComplexObject(state))) {
                change = { path, keys, key, method: method.name, args }
            }
        }

        if (!(key in target))
            target[key] = {}

        return target[key]
    }, target)

    return change
}

export default apply