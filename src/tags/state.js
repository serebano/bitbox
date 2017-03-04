import Tag from '../Tag'
import Model from '../models/state'
import handler from '../models/state.handler'

export class State extends Tag {
    constructor(keys, values) {
        super("state", keys, values)
    }
}

state.handler = handler
state.tag = State
state.model = Model

function state(keys, ...values) {
    return new State(keys, values)
}

export default state
