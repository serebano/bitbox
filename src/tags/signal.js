import Tag from '../Tag'
import {Module} from './module'
import {ensurePath} from '../utils'

function SignalModel(target, store, changes) {

    function has(path) {
        const keys = ensurePath(path)

        return keys.reduce((result, key, index) => {
            if (!result)
                return false

            if (index === keys.length - 1)
                return (key in result)

            return result[key]
        }, target.signal)
    }

    function get(path) {
        const keys = ensurePath(path)

        return keys.reduce((result, key, index) => {
            if (index > 0 && result === undefined)
                throw new Error(`Extracting with path "${path}/${key}[${index}]", but it is not valid`)

            return result[key]

        }, target.signal)
    }

    function set(path, chain) {

        const signal = (props) => store.run(path, chain, props)

        signal.displayName = path
        signal.toString = () => `function ${path}(props) { [Actions] }`


        if (!path || path === "" || path === ".") {
            target.signal = signal
        } else {
            const root = path.split(".")
            const name = root.pop()
            const parent = get(root)

            parent[name] = signal
        }

        //changes.push(`signal.${path}`)
    }

    function getChain(path) {
        const root = path.split(".")
        const name = root.pop()
        const module = store.module.get(root)

        return module.signals[name]
    }

    function setChain(path, value) {
        const root = path.split(".")
        const name = root.pop()
        const module = store.module.get(root)

        module.signals[name] = value

        //changes.push(`signal.${path}`)
    }

    return {
        has,
        get,
        set,
        getChain,
        setChain
    }
}

export class Signal extends Tag {
    constructor(keys, values) {
        super("signal", keys, values)
    }
    get(context) {
        if (context.signal && context.signal.get)
            return context.signal.get(this.path(context))
    }
    set(context, value) {
        if (context.signal && context.signal.set)
            return context.signal.set(this.path(context), value)
    }
}

signal.methods = (run) => ({
    run(...args) {
        return run(...args)
    },
    set(target, key, chain) {
        const signal = (props) => run(key, chain, props)

        signal.displayName = key
        signal.toString = () => `function ${key}(props) { [Actions] }`

        target[key] = signal
    }
})

signal.model = SignalModel

function signal(keys, ...values) {
    return new Signal(keys, values)
}

export default signal
