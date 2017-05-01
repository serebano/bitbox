import { is } from "."

function toJSON(keys) {
    return keys.map(
        key =>
            (is.array(key)
                ? toJSON(key.filter(k => !is.object(k)))
                : is.object(key)
                      ? Object.keys(key).reduce((map, k) => {
                            map[k] = is.box(key[k]) ? key[k].toJSON() : toJSON(key[k])
                            return map
                        }, {})
                      : is.func(key) ? key.toString() : key)
        //"(" + (key.displayName || key.name) + ")"
    )
}

export default toJSON
