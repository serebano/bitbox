/**
 * push(box, ...values)
 * @param {Function|Array} box
 * @param {Any} [values]
 */

function method(target, key, ...values) {
    if (!Reflect.has(target, key)) Reflect.set(target, key, [])
    Reflect.get(target, key).push(...values)
}

export default (box, ...values) => {
    function push(target) {
        box(target, method, ...values)
    }

    push.displayName = `push(${box}, ${values.map(String)})`

    return push
}
