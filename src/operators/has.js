import bitbox from "../bitbox"

/**
 * has
 * @param  {Function|Array} box
 * @return {Any}
 */

export default function(box) {
    function has(target) {
        return bitbox.has(target, box)
    }

    has.displayName = `has(${box})`

    return has
}
