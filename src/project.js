import is from "./is"
import resolve from "./resolve"
import { print } from "./operators"

function project(target, mapping) {
    return new Proxy(mapping, {
        get(map, key, receiver) {
            if (key === "$") {
                const $ = {
                    target,
                    mapping,
                    isObservable: { target: is.observable(target), mapping: is.observable(mapping) }
                }
                print($)
                return $
            }

            const targetValue = Reflect.get(target, key)

            if (is.undefined(targetValue)) {
                const mapValue = Reflect.get(map, key, receiver)

                if (is.box(mapValue)) return resolve(target, mapValue)
                if (is.object(mapValue)) return project(target, mapValue)

                return mapValue
            }

            return targetValue
        },
        set(mapping, key, value) {
            if (Reflect.has(mapping, key)) {
                const mapValue = Reflect.get(mapping, key)
                if (is.box(mapValue)) return resolve(target, mapValue, value)
            }

            Reflect.set(target, key, value)

            return Reflect.set(mapping, key, value)
        }
    })
}

export default project