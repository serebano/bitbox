import create from "./create"
import map from "./map"

function box(input) {
    return create.proxy(map(input))
}

export default box
