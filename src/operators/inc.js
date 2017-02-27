import {compute} from '../tags'

export default (target, value) => {
    const newValue = compute(target, value, (count = 0, add = 1) => count + add)

    function increment(context) {
        context.set(target, newValue)
    }

    return increment
}
