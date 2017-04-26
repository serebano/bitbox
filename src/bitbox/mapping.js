import create from "./create"
import { is } from "../utils"

/**
 * bitbox.map(mapping, context)
 * @param {Object} mapping
 * @param {Function} context
 */

function Mapping(mapping, context) {
    if (mapping instanceof Mapping) return mapping
    if (is.func(mapping)) return new Mapping(mapping(context), context)
    if (!(this instanceof Mapping)) return new Mapping(...arguments)

    return Object.keys(mapping || {}).reduce((map, key) => {
        map[key] = is.array(mapping[key])
            ? context ? context(...mapping[key]) : create(mapping[key])
            : is.box(mapping[key]) ? mapping[key] : create([mapping[key]])
        return map
    }, this)
}

export default Mapping
