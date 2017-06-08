import is from "../is"
import desc from "./desc"

function curry1(fn) {
    function f1(a) {
        if (arguments.length === 0) {
            return f1
        } else {
            if (is.placeholder(a)) {
                if (is.func(a) && a.isHandler) return curry1(x => fn(a(x)))

                return f1
            }
            return fn.apply(this, arguments)
        }
    }

    f1.toString = () => String(fn)

    return f1
}

export default curry1
