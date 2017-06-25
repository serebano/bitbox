import curry from "../curry"

export default curry(function stringify(target) {
    return JSON.stringify(target, null, 4)
})
