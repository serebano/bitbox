import bitbox from "../bitbox"

/**
 * keys
 * @param  {Function|Array} box
 * @return {Any}
 */

export default function(box) {
    function keys(target) {
        return bitbox.keys(target, box)
    }

    keys.displayName = `keys(${box})`

    return keys
}
