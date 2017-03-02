import { update } from './'

export default (target, ...args) => {

    function push(parent, key, ...values) {
        parent[key].push(...values)
    }

    return update(target, push, ...args)
}
