import Tag from '../Tag'

function state(keys, ...values) {
    return new Tag("state", keys, values)
}

export default state
