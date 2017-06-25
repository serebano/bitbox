import curry from "../curry"

export default curry(function as(prop, value) {
    return {
        [prop]: value
    }
})
