import {compute} from '../tags'

export default function merge(target, ...values) {

    const value = compute(...arguments, (...values) => Object.assign({}, ...values))

    return (context) => target.set(context, value)
}
