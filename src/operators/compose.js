import curry from "../curry"

function compose(path) {
    const fns = Array.isArray(path) ? path : [...arguments]

    function f(result) {
        for (var i = fns.length - 1; i > -1; i--) {
            try {
                result = fns[i].call(this, result)
            } catch (e) {
                e.message = f.toString() + " blew up on " + fns[i].toString()
                throw e
            }
        }
        return result
    }

    f.toString = () => "compose(" + fns.map(f => f.toString()).join(", ") + ")"

    return f
}

export default curry(compose)
