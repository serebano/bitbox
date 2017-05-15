import create from "./create"
import resolve from "./resolve"
import mapping from "./mapping"
import is from "./operators/is"

function map(mapping, ...args) {
    return construct(mapping, args)
}

function box(input, ...args) {
    const mapping = construct(input, args)

    return new Proxy(
        function mapbox(target, ...args) {
            return resolve(target, mapping, ...args)
        },
        {
            get(box, key) {
                return Reflect.get(mapping, key)
            },
            set(box, key, value) {
                return Reflect.set(mapping, key, value)
            }
        }
    )
}

function construct(input, args) {
    if (mapping.has(input)) return mapping.get(input)

    if (is.func(input)) {
        const map = input(create([]), ...args)
        mapping.set(input, map)

        return map
    }

    mapping.set(input, input)

    return input
}

map.box = box
map.construct = construct

export default map
