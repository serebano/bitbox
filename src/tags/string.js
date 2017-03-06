import Tag from '../Tag'

function string(keys, ...values) {
    return new Tag("string", keys, values)
}

export default string
