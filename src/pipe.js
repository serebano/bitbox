import compose from "./compose"

function pipe(...fns) {
    return compose.apply(null, fns.reverse())
}

export default pipe
