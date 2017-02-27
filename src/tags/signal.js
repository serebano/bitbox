import Tag from '../Tag'
import {Module} from './module'
import {ensurePath} from '../utils'

function SignalModel(target, store, changes) {

    function get(path) {
        const keys = ensurePath(path)
        //console.log(`signal.get(${path})`, keys)

        return keys.reduce((result, key, index) => {
            if (index > 0 && result === undefined)
                throw new Error(`Extracting with path "${path}/${key}[${index}]", but it is not valid`)
            return result[key]
        }, target.signal)
    }

    function set(path, value) {
        if (!path || path === "" || path === ".") {
            target.signal = value
        } else {
            const keys = path.split(".")
            const key = keys.pop()
            const parent = get(keys)

            parent[key] = value
        }

        //console.log(`signal.set(${path})`, value)
        changes.push(`signal.${path}`)
    }

    function getChain(path) {
        //console.log(`signal.get(${path})`)
        const root = path.split(".")
        const name = root.pop()
        const module = store.module.get(root)
        const chain = module.signals[name]
        const signal = (props) => store.run(name, chain, props)

        signal.toString = () => `function ${path}(props) {}`

        return signal
    }

    function setChain(path, value) {
        const root = path.split(".")
        const name = root.pop()
        const module = store.module.get(root)

        module.signals[name] = value

        //console.warn(`signal.set(${path})`, value)
        changes.push(`signal.${path}`)
    }

    return {
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

signal.model = SignalModel

function signal(keys, ...values) {
    return new Signal(keys, values)
}

export default signal
