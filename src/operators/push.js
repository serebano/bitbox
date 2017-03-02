import { update } from './'

export default (...args) => {
    return update(...args,
        function push(parent, key, ...values) {
            parent[key].push(...values)
        }
    )
}
