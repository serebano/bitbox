import curry from "../../curry"

function divide(a, b) {
    return a / b
}

export default curry(divide)
