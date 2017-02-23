import Tag from '../../Tag'
import Module from './Module'
import {ensurePath} from '../../utils'

export function getModule(module, path) {
    return ensurePath(path).reduce((mod, key) => {
        return mod instanceof Module
            ? mod.modules[key]
            : undefined
    }, module)
}

export default function moduleTag(tags) {
    function module(keys, ...values) {
        return new Tag("module", {
            resolve(context) {
                const path = this.path(context)
                const module = getModule(context.store.module, path)

                if (!module)
                    throw new Error(`Module not found at path: ${path}`)

                return module
            },
            set(context, module) {
                const path = this.path(context)
                const root = path.split(".")
                const key = root.pop()
                const parent = getModule(context.store.module, root)

                if (parent && key)
                    return (parent.modules[key] = new Module(context.store, root.concat(key), module))
                else
                    return (context.store.module = new Module(context.store, [], module))

            }
        }, keys, values)
    }

    module.Module = Module
    module.extract = getModule

    return module
}
