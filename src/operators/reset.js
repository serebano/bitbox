import { update } from './'

export default (...args) => {
    return update(...args,
        function reset(target, key, value) {
            target[key] = value
        }
    )
}
