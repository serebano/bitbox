import bitbox from "."
import create from "./create"
import { is } from "../utils"

/**
 * bitbox.map(mapping, root)
 * @param {Object} mapping
 * @param {Function} root
 */

function Mapping(mapping, root) {
    if (mapping instanceof Mapping) return mapping
    if (!(this instanceof Mapping)) return new Mapping(...arguments)

    mapping = is.function(mapping) ? mapping(root || bitbox.root()) : mapping
    root = root || []

    return Object.keys(mapping || {}).reduce((map, key) => {
        map[key] = is.array(mapping[key])
            ? create([...root, ...mapping[key]])
            : is.box(mapping[key]) ? mapping[key] : create([...root, mapping[key]])
        return map
    }, this)
}

export default Mapping
