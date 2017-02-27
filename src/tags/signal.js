import Tag from '../Tag'
import {Module} from './module'

export class Signal extends Tag {

    constructor(keys, values) {
        super("signal", keys, values)
    }

    get(context) {
        const path = this.path(context)
        const root = path.split(".")
        const name = root.pop()
        const module = Module.extract(context, root)

        const chain = module.signals[name]
        if (!chain)
            throw new Error(`Signal(${name}) not found @${module.path}`)

        return (props) => context.store.run(name, chain, props)

        return {
            path: module.path,
            name,
            chain,
            run: (props) => context.store.run(this, props)
        }
    }

    set(context, value, done) {
        Tag.resolve(context, value, resolved => {
            const path = this.path(context)
            const root = path.split(".")
            const key = root.pop()
            const module = Module.extract(context, root)

            module.signals[key] = resolved

            done && done(this.path(context, true))
        })
    }
}

function signal(keys, ...values) {
    return new Signal(keys, values)
}

export default signal
