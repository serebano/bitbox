import apply from "./apply"
import compose from "./compose"
import curry from "../curry"

function pipePath(path, target) {
    return apply(compose, path.reverse())(target)
}

export default curry(pipePath)
