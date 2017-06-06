import is from "../is"
import desc from "./desc"

function curry1(fn) {
    function f1(a) {
        if (arguments.length === 0 || is.placeholder(a)) {
            return f1
        } else {
            return fn.apply(this, arguments)
        }
    }

    return desc(fn, f1)
}

export default curry1
