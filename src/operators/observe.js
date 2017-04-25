import bitbox from "../bitbox"

/**
 * observe(box)
 * @param  {Function} box
 * @return {Function}
 */

export default box => {
    return function observe(target) {
        return bitbox.observe(target, box)
    }
}
