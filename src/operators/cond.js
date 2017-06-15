import box from "../box"
import { createFn } from "../curry/create"
import max from "./max"
import map from "./map"
import reduce from "./reduce"

export default box(function cond(pairs) {
    let arity = reduce(
        max,
        0,
        map(function(pair) {
            return pair[0].length
        }, pairs)
    )
    return createFn(arity, function() {
        let idx = 0
        while (idx < pairs.length) {
            if (pairs[idx][0].apply(this, arguments)) {
                return pairs[idx][1].apply(this, arguments)
            }
            idx += 1
        }
    })
})
