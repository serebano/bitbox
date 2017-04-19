import { is, toPrimitive } from "../utils"
import bitbox from "../bitbox"

/**
 * map
 * @param  {Object} mapping
 * @return {Object}
 */

export default function(mapping) {
    mapping = is.function(mapping) ? mapping(bitbox.root()) : mapping

    function map(target) {
        return bitbox.map(target, mapping)
    }

    map.displayName = toPrimitive([mapping])

    return map
}
