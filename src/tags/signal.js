import Tag from '../Tag'

function signal(keys, ...values) {
    return new Tag("signals", keys, values)
}

export default signal
