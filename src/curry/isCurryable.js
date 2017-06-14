export const isCurryable = Symbol("isCurryable")

export default function(fn) {
    return fn[isCurryable] === true
}
