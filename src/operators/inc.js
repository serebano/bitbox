import compute from '../handlers/compute'

export default (target, value) => {
    return (context) => {
        return target.set(context, compute(target, value, (a = 0, b = 1) => a + b))
    }
}
