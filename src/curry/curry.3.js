import curry1 from "./curry.1"
import curry2 from "./curry.2"
import is from "../is"
import desc from "./desc"

function curry3(fn) {
    function f3(a, b, c) {
        switch (arguments.length) {
            case 0:
                return f3
            case 1:
                return is.placeholder(a)
                    ? f3
                    : curry2(function(_b, _c) {
                          return fn(a, _b, _c)
                      })
            case 2:
                return is.placeholder(a) && is.placeholder(b)
                    ? f3
                    : is.placeholder(a)
                      ? curry2(function(_a, _c) {
                            return fn(_a, b, _c)
                        })
                      : is.placeholder(b)
                        ? curry2(function(_b, _c) {
                              return fn(a, _b, _c)
                          })
                        : curry1(function(_c) {
                              return fn(a, b, _c)
                          })
            default:
                return is.placeholder(a) && is.placeholder(b) && is.placeholder(c)
                    ? f3
                    : is.placeholder(a) && is.placeholder(b)
                      ? curry2(function(_a, _b) {
                            return fn(_a, _b, c)
                        })
                      : is.placeholder(a) && is.placeholder(c)
                        ? curry2(function(_a, _c) {
                              return fn(_a, b, _c)
                          })
                        : is.placeholder(b) && is.placeholder(c)
                          ? curry2(function(_b, _c) {
                                return fn(a, _b, _c)
                            })
                          : is.placeholder(a)
                            ? curry1(function(_a) {
                                  return fn(_a, b, c)
                              })
                            : is.placeholder(b)
                              ? curry1(function(_b) {
                                    return fn(a, _b, c)
                                })
                              : is.placeholder(c)
                                ? curry1(function(_c) {
                                      return fn(a, b, _c)
                                  })
                                : fn(a, b, c)
        }
    }

    return f3 //desc(fn, f3, 3)
}

export default curry3
