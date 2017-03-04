import Tag from '../Tag'

class Props extends Tag {
    constructor(keys, values) {
        super("props", keys, values)
    }
}

function props(keys, ...values) {
    return new Props(keys, values)
}

export default props
