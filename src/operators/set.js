/**
 * set(box, value)
 * @param {Function|Array} box
 * @param {Any} value
 */

export default (box, value) => {
    function set(target) {
        box(target, Reflect.set, value)
    }

    set.displayName = `set(${box}, ${value})`

    return set
}
