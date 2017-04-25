import bitbox from "../bitbox"

/**
 * apply
 * @param  {Function|Array} box
 * @return {Any}
 */

export default function(box, args) {
    function apply(target) {
        return bitbox.apply(target, box, args)
    }

    return apply
}
