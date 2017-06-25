import curry from "../curry"
import max from "./max"
import map from "./map"
import reduce from "./reduce"

export default curry(function cond(pairs) {
    const arity = reduce(max, 0, map(pair => pair[0].length, pairs))

    return curry(function() {
        let idx = 0
        while (idx < pairs.length) {
            if (pairs[idx][0].apply(this, arguments)) {
                return pairs[idx][1].apply(this, arguments)
            }
            idx += 1
        }
    }, arity)
})
