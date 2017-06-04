import curry from "../curry"
import is from "./is"

export function nth(offset, list) {
    const idx = offset < 0 ? list.length + offset : offset

    return is(String, list) ? list.charAt(idx) : list[idx]
}

export default curry(nth)
