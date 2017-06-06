import apply from "./apply"
import compose from "./compose"

function pipe(...fns) {
    return apply(compose, fns.reverse())
}

export default pipe
