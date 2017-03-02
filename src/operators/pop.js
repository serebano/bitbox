import { update } from './'

export default (target) => {
    return update(target,
		function pop(parent, key) {
            parent[key].pop()
        }
    )
}
