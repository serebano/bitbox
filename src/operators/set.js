import { update } from './'

function set(target, value) {
    return update(target, value,
        function set(target, key, value) {
            target[key] = value
        }
    )
}

export default set
