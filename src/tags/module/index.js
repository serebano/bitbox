import Tag from '../../Tag'
import M from './Module'
import {ensurePath,getProviders} from '../../utils'

function ModuleModel(target, store, changes) {

    function get(path) {
        const keys = ensurePath(path)
        //console.log(`module.get(${path})`, keys)

        return keys.reduce((mod, key) => {
            return mod
                ? mod.modules[key]
                : undefined
        }, target.module)
    }

    function set(path, value) {
        if (path === ".") {
            target.module = new M(store, [], value)
        } else {

            const keys = path.split(".")
            const key = keys.pop()
            const parent = get(keys)

            parent.modules[key] = new M(store, keys.concat(key), value)
        }

        //console.log(`module.set(${path})`, value)

        changes.push(`module.${path}`)
    }

    function providers() {
        return getProviders(target.module)
    }

    return {
        get,
        set,
        providers
    }
}

export class Module extends Tag {
    constructor(keys, values) {
        super("module")
        this.keys = keys
        this.values = values
    }
    get(context) {
        if (context.module && context.module.get)
            return context.module.get(this.path(context))
    }
    set(context, value) {
        if (context.module && context.module.set)
            return context.module.set(this.path(context), value)
    }
}

function module(keys, ...values) {
    return new Module(keys, values)
}

module.model = ModuleModel
module.Module = Module

export default module
