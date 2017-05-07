import create from "./create"
import resolve from "./resolve"
import is from "./operators/is"
import * as operators from "./operators"
import map from "./map"

function box(input) {
    const box = create.proxy(map(input))
    return box
}

export default box
