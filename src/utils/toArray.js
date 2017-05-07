import { is } from "."
import mapping from "../mapping"

function toArray(keys) {
    return keys.map(key => {
        if (is.object(key)) {
            return Object.keys(key).reduce((map, mapKey) => {
                map[mapKey] = is.box(key[mapKey]) ? key[mapKey].toArray() : key[mapKey]
                return map
            }, {})
        }
        if (is.box(key)) {
            return key.toArray()
        }

        return key
    })
}

export default toArray
