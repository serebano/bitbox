import create from "./create"
import is from "../is"

function arg(a) {
    const ctx1 = this
    console.log(`arg(${a}) -> (b)`, ctx1)

    function $arg(...b) {
        const ctx2 = this
        const c = a(...b)
        console.log(` ->`, { a, b, c, ctx1, ctx2 })

        return c
    }

    $arg["@@functional/placeholder"] = true

    return $arg
}

arg["@@functional/placeholder"] = true

export default arg
