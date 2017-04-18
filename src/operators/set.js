import bitbox from "../bitbox";

/**
 * set
 * @param {Function|Array} box
 * @param {Any} value
 */

export default function(box, value) {
    function set(target) {
        bitbox.set(target, box, value);
    }

    set.displayName = `set(${box}, ${value})`;

    return set;
}
