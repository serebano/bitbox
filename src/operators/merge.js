import compute from '../handlers/compute'

export default function merge(target, ...values) {

    const value = compute(...arguments, (...values) => Object.assign({}, ...values))

    return (context) => target.set(context, value)
}
