import create from "./create"
import resolve from "./resolve"
import is from "../operators/is"
import * as operators from "../operators"
import mapping from "./mapping"

function box(input) {
    if (mapping.has(input)) {
        const map = mapping.get(input)
        console.log(`box/mapping/has`, { input, map })
        return map
    }

    if (is.func(input)) {
        const proxy = new Proxy(create([], true), {
            get(target, key) {
                const box = create([key])
                console.log(`box-proxy-get`, key, box)
                return box
            }
        })
        const map = input(create([], true), operators)
        const box = create.proxy(map)

        mapping.set(input, box)
        console.log(`box/mapping/is.func/set`, { input, map, box })

        return box
    }

    mapping.set(input, input)
    console.log(`box/mapping/is.object/set`, { input })

    return input
}

export default box
