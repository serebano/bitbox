import Tag from '../Tag'
import Model from '../models/signals'

export class Signal extends Tag {
    constructor(keys, values) {
        super("signals", keys, values)
    }
}

signal.model = Model

function signal(keys, ...values) {
    return new Signal(keys, values)
}

export default signal
