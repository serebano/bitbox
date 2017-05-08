import create from "./create"
import resolve from "./resolve"
import is from "../operators/is"
import * as operators from "../operators"

function construct(target, args) {
    if (is.func(target)) {
        return target(create([]), operators)
    }

    return target
}

export default construct
