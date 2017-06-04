import is from "../is"
import curry from "../curry"
import resolve from "../resolve"

function view(mapping, target) {
    return new Proxy(mapping, {
        get(map, key) {
            console.log(`view->get`, key)
            if (Reflect.has(map, key)) {
                const value = Reflect.get(map, key)
                if (is.func(value)) return value(target)
                if (is.object(value)) return view(value, target)
                return value
            }
        }
        // set(map, key, value, receiver) {
        //     return Reflect.set(map, key, value, receiver)
        // }
    })
}

export default curry(view)
