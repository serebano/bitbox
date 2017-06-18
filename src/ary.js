import curry from "./curry"

const ary = curry(function ary(n, fn) {
    switch (n) {
        case 0:
            return function f0() {
                return fn.call(this)
            }
        case 1:
            return function f1(a0) {
                return fn.call(this, a0)
            }
        case 2:
            return function f2(a0, a1) {
                return fn.call(this, a0, a1)
            }
        case 3:
            return function f3(a0, a1, a2) {
                return fn.call(this, a0, a1, a2)
            }
        case 4:
            return function f4(a0, a1, a2, a3) {
                return fn.call(this, a0, a1, a2, a3)
            }
        case 5:
            return function f5(a0, a1, a2, a3, a4) {
                return fn.call(this, a0, a1, a2, a3, a4)
            }
        case 6:
            return function f6(a0, a1, a2, a3, a4, a5) {
                return fn.call(this, a0, a1, a2, a3, a4, a5)
            }
        case 7:
            return function f7(a0, a1, a2, a3, a4, a5, a6) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6)
            }
        case 8:
            return function f8(a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7)
            }
        case 9:
            return function f9(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8)
            }
        case 10:
            return function f10(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9)
            }
        default:
            throw new Error("First argument to ary must be a non-negative integer no greater than ten")
    }
})

export const unary = ary(1)
export const binary = ary(2)
export const ternary = ary(3)

export default ary
