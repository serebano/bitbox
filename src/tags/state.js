import Tag from '../Tag'
import Model from '../Model'

export class State extends Tag {
    constructor(keys, values) {
        super("state", keys, values)
    }
}

state.model = (target, store) => Model("state", target, store)

function state(keys, ...values) {
    return new State(keys, values)
}

export default state
