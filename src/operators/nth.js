import curry from "../curry"
import is from "./is"

function nth(offset, list) {
    const idx = offset < 0 ? list.length + offset : offset

    return is(String, list) ? list.charAt(idx) : list && list[idx]
}

export default curry(nth)
