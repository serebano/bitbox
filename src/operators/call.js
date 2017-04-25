import bitbox from "../bitbox"

/**
 * call
 * @param  {Function|Array} box
 * @return {Any}
 */

export default function(box, ...args) {
    function call(target) {
        return bitbox.apply(target, box, args)
    }

    return call
}
