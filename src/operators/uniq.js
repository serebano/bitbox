import curry from "../curry"

export default curry(function uniq(list) {
    return Array.from(new Set(list))
})
