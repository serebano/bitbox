import curry from "../curry"

export default curry(function replace(regex, replacement, str) {
    return str.replace(regex, replacement)
})
