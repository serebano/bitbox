import curry from "../curry"

export default curry(function toArray(value) {
    return Array.from(value)
})
