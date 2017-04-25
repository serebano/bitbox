import bitbox from "../bitbox"

/**
 * apply
 * @param  {Function|Array} box
 * @return {Any}
 */

export default (box, args) => {
    return function apply(target) {
        return bitbox.apply(target, box, args)
    }
}
