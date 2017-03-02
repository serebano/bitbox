import { update } from './'

export default (target) => {
    return update(target,
        function unset(target, key) {
            delete target[key]
        }
    )
}
