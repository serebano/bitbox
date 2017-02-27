import {compute} from '../tags'

export default (target, value) => {
    return function decrement(context) {
        return context.set(target, compute(target, value, (a = 0, b = 1) => a - b))
    }
}