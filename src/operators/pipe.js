import curry from "../curry"
import apply from "./apply"
import compose from "./compose"
import reverse from "./reverse"

function pipe(path) {
    const fns = Array.isArray(path) ? path : [...arguments]
    const f = compose(reverse(fns))
    f.toString = () => "pipe(" + fns.map(f => f.toString()).join(", ") + ")"
    return f
}

export default curry(pipe)
