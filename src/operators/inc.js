import { update } from './'

export default (target, value = 1) => {

    function inc(target, key, value) {
        if (!(key in target))
            target[key] = 0

        target[key] =+ value
    }

    return update(target, inc, value)
}
