import curry from "../../curry"

function multiply(a, b) {
    return a * b
}

export default curry(multiply)
