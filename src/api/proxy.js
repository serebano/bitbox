import bitbox from "../bitbox"
import { proxy } from "../operators"
import is from "../is"

const obj = {}

const box = bitbox(proxy, {
    get(target, key) {
        if (!Reflect.has(target, key)) Reflect.set(target, key, {})
        const result = Reflect.get(target, key)

        return is.object(result) ? proxy(result, this) : result
    }
})

box.foo.bar.baz.count(obj, 100)

export default { box, obj }
