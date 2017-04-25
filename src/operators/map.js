import bitbox from "../bitbox"

/**
 * map(mapping, root)
 * @param  {Object} mapping
 * @return {Function}
 */

export default (mapping, root) => {
    return function map(target) {
        return bitbox.map(target, mapping, root)
    }
}
