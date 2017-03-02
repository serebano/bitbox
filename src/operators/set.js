import { update } from './'

function set(target, value) {
    return update(
        target,
        function set(target, key, value) {
            target[key] = value
        },
        value
    )
}

export default set
