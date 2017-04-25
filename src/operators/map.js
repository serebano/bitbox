import bitbox from "../bitbox"

/**
 * map(mapping, root)
 * @param  {Object} mapping
 * @return {Function}
 */

export default (mapping, root) => {
    const map = bitbox.map(mapping, root)

    return target => bitbox.proxy(target, map)
}
