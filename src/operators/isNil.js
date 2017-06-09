import curry from "../curry"
export default curry(function isNil(x) {
    return x == null
})
