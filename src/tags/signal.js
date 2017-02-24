import Tag from '../Tag'
import {ensurePath} from '../utils'
import module from './module'

const {cache} = Tag

signal.tag = class Signal extends Tag {
    get(context) {
        const path = this.path(context)
        const root = ensurePath(path)
        const key = root.pop()
        const value = module.extract(context.store.module, root)

        if (!value)
            throw new Error(`Module not found at path: ${path}`)

        return value.signals[key]
    }
    set(context, value) {
        const path = this.path(context)
        const root = ensurePath(path)
        const key = root.pop()
        const target = module.extract(context.store.module, root)

        target.signals[key] = value

        return true
    }
}

function signal(keys, ...values) {
    return new signal.tag("signal", {}, keys, values)
}

export default signal
