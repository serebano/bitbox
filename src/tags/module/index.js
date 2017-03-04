import Tag from '../../Tag'
import Model from '../../models/modules'

export class Module extends Tag {
    constructor(keys, values) {
        super("module", keys, values)
    }
}

module.model = Model

function module(keys, ...values) {
    return new Module(keys, values)
}

export default module
