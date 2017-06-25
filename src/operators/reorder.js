import curry from "../curry"

const MAX_SAFE_INTEGER = 9007199254740991
/** Used to detect unsigned integer values. */
const reIsUint = /^(?:0|[1-9]\d*)$/

function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length
    return (
        !!length &&
        (typeof value == "number" || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length)
    )
}

export default curry(function reorder(indexes, arr) {
    const oldArray = arr
    const array = [...arr]
    const arrLength = array.length
    let length = Math.min(indexes.length, arrLength)
    while (length--) {
        const index = indexes[length]
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined
    }
    return array
})
