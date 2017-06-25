import curry from "./curry"

export default curry(function type(val) {
    return val === null ? "null" : val === undefined ? "undefined" : Object.prototype.toString.call(val).slice(8, -1)
})
