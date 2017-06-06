import desc from "./desc"

function createFunction(length, fn) {
    switch (length) {
        case 0:
            return function f0() {
                return fn.apply(this, arguments)
            }
        case 1:
            return function f1(a0) {
                return fn.apply(this, arguments)
            }
        case 2:
            return function f2(a0, a1) {
                return fn.apply(this, arguments)
            }
        case 3:
            return function f3(a0, a1, a2) {
                return fn.apply(this, arguments)
            }
        case 4:
            return function f4(a0, a1, a2, a3) {
                return fn.apply(this, arguments)
            }
        case 5:
            return function f5(a0, a1, a2, a3, a4) {
                return fn.apply(this, arguments)
            }
        case 6:
            return function f6(a0, a1, a2, a3, a4, a5) {
                return fn.apply(this, arguments)
            }
        case 7:
            return function f7(a0, a1, a2, a3, a4, a5, a6) {
                return fn.apply(this, arguments)
            }
        case 8:
            return function f8(a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.apply(this, arguments)
            }
        case 9:
            return function f9(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.apply(this, arguments)
            }
        case 10:
            return function f10(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.apply(this, arguments)
            }
        default:
            throw new Error("First argument to _arity must be a non-negative integer no greater than ten")
    }
}

export default createFunction //(n, fn) => desc(fn, createFunction(n, fn), [], n)
