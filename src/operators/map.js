import { toPrimitive } from "../utils"
import bitbox from "../bitbox"

/**
 * map
 * @param  {Object} mapping
 * @return {Object}
 */

export default function(mapping) {
    function map(target) {
        return bitbox.map(target, mapping)
    }

    map.displayName = toPrimitive([mapping])

    return map
}
