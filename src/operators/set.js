import bitbox from "../"
/**
 * set(box, value)
 * @param {Function|Array} box
 * @param {Any} value
 */

export default (box, value) => {
    return function set(target) {
        return bitbox.set(target, box, value)
    }
}
