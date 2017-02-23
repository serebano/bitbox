import Tag from '../Tag'
import {ensurePath} from '../utils'
import module from './module'

const {cache} = Tag

function signal(keys, ...values) {
    return new Tag("signal", {
        get(context) {
            const path = this.path(context)
            const root = ensurePath(path)
            const key = root.pop()
            const value = module.extract(context.store.module, root)

            if (!value)
                throw new Error(`Module not found at path: ${path}`)

            cache.set(this.type, path, value.signals[key])

            return value.signals[key]
        },
        set(context, value) {
            const path = this.path(context)
            const root = ensurePath(path)
            const key = root.pop()
            const target = module.extract(context.store.module, root)

            target.signals[key] = value
            cache.set(this.type, path, value)

            return true
        }
    }, keys, values)
}

export default signal
