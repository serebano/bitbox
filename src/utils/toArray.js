import is from "../is"

function toArray(keys) {
    return keys.map(key => {
        if (is.object(key)) {
            return Object.keys(key).reduce((map, mapKey) => {
                map[
                    is.box(key[mapKey]) && key[mapKey].box && key[mapKey].box.name
                        ? `${mapKey}:${key[mapKey].box.name}`
                        : mapKey
                ] = is.box(key[mapKey]) ? key[mapKey].toArray() : key[mapKey]
                return map
            }, {})
        }
        if (is.box(key)) {
            return key.toArray()
        }
        //if (is.array(key)) return key.join(".")
        return key
    })
}

export default toArray
