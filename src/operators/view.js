import is from "../is"
import _curry2 from "../internal/curry2"
import resolve from "../resolve"

function view(mapping, target) {
    return new Proxy(mapping, {
        get(map, key, receiver) {
            if (Reflect.has(map, key, receiver)) {
                const value = Reflect.get(map, key, receiver)

                if (is.box(value)) {
                    return value(target) // resolve(target, value[Symbol.for("box/path")]) //value(target)
                }

                if (is.object(value)) {
                    return view(value, target)
                }

                if (is.func(value)) {
                    return (...args) => value.apply(receiver, args)
                }

                return Reflect.get(target, key)
            }
        },
        set(map, key, value, receiver) {
            if (Reflect.has(map, key, receiver)) {
                const bx = Reflect.get(map, key, receiver)

                if (is.box(bx)) {
                    return resolve(target, bx[Symbol.for("box/path")], value)
                }
            }
            return Reflect.set(map, key, value, receiver)
        }
    })
}

export default _curry2(view)
