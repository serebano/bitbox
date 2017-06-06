import curry from "../curry/curry.x"

function type(val) {
    return val === null ? "Null" : val === undefined ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1)
}

export default curry(type)
