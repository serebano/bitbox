import box from "../box"
import _indexOf from "./indexOf"
import contains from "./contains"

export default box(function difference(first, second) {
    let out = []
    let idx = 0
    let firstLen = first.length
    while (idx < firstLen) {
        if (!contains(first[idx], second) && !contains(first[idx], out)) {
            out[out.length] = first[idx]
        }
        idx += 1
    }

    return out
})
