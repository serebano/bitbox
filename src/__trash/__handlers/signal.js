import Tag from '../Tag'
import {ensurePath} from '../utils'
import {module} from '../tags'

export default function Signal(tags) {
    const cache = Tag.cache

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
                
                cache[path] = target.signals[key] = value
                cache.set(this.type, path, value)

                return true
            }
        }, keys, values)
    }

    return signal
}
