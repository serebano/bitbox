import Tag from '../../Tag'
import M from './Module'
import {ensurePath} from '../../utils'
// import state from '../state'
// import signal from '../signal'

export class Module extends Tag {

    constructor(keys, values) {
        super("module")
        this.keys = keys
        this.values = values
    }

    static extract(context, path) {
        const keys = ensurePath(path)

        return keys.reduce((mod, key) => {
            if (key === "" || key === "*" || key === "**")
                return mod

            if (!mod || !mod.modules[key])
                throw new Error(`Module(${key}) not found at path: ${path}`)

            return mod.modules[key]
        }, context.module)
    }

    static update(context, path, value) {
        if (!(context.module instanceof M))
            return (context.module = new M(context, [], value))

        const root = path.split(".")
        const key = root.pop()

        const target = root.length
            ? Module.extract(context, root)
            : context.module

        return target.modules[key] = new M(context, root.concat(key), value)

    }

    get(context) {
        const path = this.path(context)
        return Module.extract(context, path)
    }

    set(context, value, done) {
        Tag.resolve(context, value, (resolved = {}) => {
            const path = this.path(context)

            //state(path).set(context, resolved.state || {}, (statePath, stateValue) => {
                //resolved.state = stateValue

                Module.update(context, path, resolved)

                if (done) {
                    done(this.path(context, true))
                }
            //})
        })
    }
}

function module(keys, ...values) {
    return new Module(keys, values)
}

module.Module = Module
//module.extract = getModule

export default module
