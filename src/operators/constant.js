import curry from "../curry"

export default curry(function constant(value) {
    return () => value
})
