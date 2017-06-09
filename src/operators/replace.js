import curry from "../curry"

curry(function replace(regex, replacement, str) {
    return str.replace(regex, replacement)
})
