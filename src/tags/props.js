import Tag from '../Tag'

function props(keys, ...values) {
    return new Tag("props", keys, values)
}

export default props
