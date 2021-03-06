import { is } from ".";

function toArray(keys) {
    return keys.map(key => {
        if (is.object(key)) {
            return Object.keys(key).reduce(
                (map, mapKey) => {
                    map[mapKey] = is.box(key[mapKey]) ? key[mapKey].toArray() : key[mapKey];
                    return map;
                },
                {}
            );
        }
        return key;
    });
}

export default toArray;
