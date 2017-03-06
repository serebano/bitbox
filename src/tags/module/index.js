import Tag from '../../Tag'

function module(keys, ...values) {
    return new Tag('modules', keys, values)
}

export default module
