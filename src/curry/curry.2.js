import curry1 from "./curry.1"
import is from "../is"
import desc from "./desc"

function curry2(fn) {
    function f2(a, b) {
        switch (arguments.length) {
            case 0:
                return f2
            case 1:
                return is.placeholder(a)
                    ? f2
                    : curry1(function(_b) {
                          return fn(a, _b)
                      })
            default:
                return is.placeholder(a) && is.placeholder(b)
                    ? f2
                    : is.placeholder(a)
                          ? curry1(function(_a) {
                                return fn(_a, b)
                            })
                          : is.placeholder(b)
                                ? curry1(function(_b) {
                                      return fn(a, _b)
                                  })
                                : fn(a, b)
        }
    }

    return f2 //desc(fn, f2) //2 // desc(fn, f2, 2)
}

export default curry2
