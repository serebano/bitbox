import compute from '../handlers/compute'

export default function push(target, ...values) {

    const value = compute(
        ...arguments,
        (target = [], ...values) => target.concat(values)
    )

    return (context) => target.set(context, value)
}
