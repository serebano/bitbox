import Tag from '../Tag'
import {ensurePath} from '../utils'

function StateModel(target, store, changes) {

    function get(path) {
        if (!path || path === ".")
            return target.state

        const keys = ensurePath(path)
        //console.log(`state.get(${path})`, keys)

        return keys.reduce((result, key, index) => {
            if (index > 0 && result === undefined)
                throw new Error(`Extracting with path "${path}/${key}[${index}]", but it is not valid`)
            return result[key]
        }, target.state)
    }

    function set(path, value) {
        if (!path || path === "" || path === ".") {
            target.state = value
        } else {
            const keys = path.split(".")
            const key = keys.pop()
            const parent = get(keys)

            parent[key] = value
        }

        //console.log(`state.set(${path})`, value)
        changes.push(`state.${path}`)
    }

    return {
        get,
        set
    }
}

export class State extends Tag {

    constructor(keys, values) {
        super("state", keys, values)
    }

    get(context) {
        if (context.state && context.state.get)
            return context.state.get(this.path(context))
    }

    set(context, value) {
        if (context.state && context.state.set)
            return context.state.set(this.path(context), value instanceof Tag ? value.get(context) : value)
    }
}

state.model = StateModel

export default function state(keys, ...values) {
    return new State(keys, values)
}
