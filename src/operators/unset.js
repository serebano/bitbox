import bitbox from "../bitbox"

/**
 * unset
 * @param {Function|Array} box
 */

export default function(box) {
    function unset(target) {
        bitbox.delete(target, box)
    }

    unset.displayName = `unset(${box})`

    return unset
}
