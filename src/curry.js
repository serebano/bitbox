import { getArgNames } from "./utils"
import _isPlaceholder from "./internal/isPlaceholder"

const slice = Array.prototype.slice

function toArray(a) {
    return slice.call(a)
}
function tail(a) {
    return slice.call(a, 1)
}

export function createFn(fn, args, length) {
    const argNames = getArgNames(fn)
    fn._args = argNames
    fn._length = length

    function createProxy(received) {
        let _combined = received
        const proxy = new Proxy(fn, {
            apply(target, context, args) {
                let left = length
                let combined = []
                let argsIdx = 0
                let resIdx = 0
                while (resIdx < received.length || argsIdx < args.length) {
                    let result
                    if (resIdx < received.length && (!_isPlaceholder(received[resIdx]) || argsIdx >= args.length)) {
                        result = received[resIdx]
                    } else {
                        result = args[argsIdx]
                        argsIdx += 1
                    }
                    combined[resIdx] = result
                    if (!_isPlaceholder(result)) left -= 1
                    resIdx += 1
                }
                target._length = left
                _combined = combined
                if (left <= 0) return target.apply(context, combined)
                return createProxy(combined)
            },
            get(target, key) {
                if (key === "length") return target._length
                if (key === "$") return argNames.map((arg, idx) => [idx, arg, _combined[idx]])
                if (key === Symbol.toPrimitive) return () => `${target.name}(${argNames.join(", ")})`
                if (key === "toJSON")
                    return () => `${target.name}(${argNames.map((arg, idx) => `${arg}: ${_combined[idx]}`).join(", ")})`

                if (Reflect.has(target, key)) return Reflect.get(target, key)
            }
        })

        return proxy
    }

    return createProxy(args)
}

export function _createFn(fn, args, totalArity) {
    const remainingArity = totalArity - args.length

    switch (remainingArity) {
        case 0:
            function c0() {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c0._name = fn.name
            return c0
        case 1:
            function c1(a) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c1._name = fn.name
            return c0
        case 2:
            function c2(a, b) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c2._name = fn.name
            return c2
        case 3:
            function c3(a, b, c) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c3._name = fn.name
            return c3
        case 4:
            function c4(a, b, c, d) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c4._name = fn.name
        case 5:
            function c5(a, b, c, d, e) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c5._name = fn.name
            return c5
        case 6:
            function c6(a, b, c, d, e, f) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c6._name = fn.name
            return c6
        case 7:
            function c7(a, b, c, d, e, f, g) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c7._name = fn.name
            return c7
        case 8:
            function c8(a, b, c, d, e, f, g, h) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c8._name = fn.name
            return c8
        case 9:
            function c9(a, b, c, d, e, f, g, h, i) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c9._name = fn.name
            return c9
        case 10:
            function c10(a, b, c, d, e, f, g, h, i, j) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity)
            }
            c10._name = fn.name
            return c10
        default:
            return createEvalFn(fn, args, remainingArity)
    }
}

// [value], arguments -> [value]
//-- concat new arguments onto old arguments array
function concatArgs(args1, args2) {
    return args1.concat(toArray(args2))
}

// fn, [value], int -> fn
//-- create a function of the correct arity by the use of eval,
//-- so that curry can handle functions of any arity
function createEvalFn(fn, args, arity) {
    var argList = makeArgList(arity)
    //-- hack for IE's faulty eval parsing -- http://stackoverflow.com/a/6807726
    var fnStr = "false||" + "function(" + argList + "){ return processInvocation(fn, concatArgs(args, arguments)); }"
    return eval(fnStr)
}

function makeArgList(len) {
    var a = []
    for (var i = 0; i < len; i += 1)
        a.push("a" + i.toString())
    return a.join(",")
}

function trimArrLength(arr, length) {
    if (arr.length > length) return arr.slice(0, length)
    else return arr
}

// fn, [value] -> value
//-- handle a function being invoked.
//-- if the arg list is long enough, the function will be called
//-- otherwise, a new curried version is created.
function processInvocation(fn, argsArr, totalArity) {
    argsArr = trimArrLength(argsArr, totalArity)

    if (argsArr.length === totalArity) return fn.apply(null, argsArr)
    return createFn(fn, argsArr, totalArity)
}

// fn -> fn
//-- curries a function! <3
function curry(fn) {
    return createFn(fn, [], fn.length)
}
//curry.proxy = (fn, args = []) => createProxy(fn, args, fn.length)
// num, fn -> fn
//-- curries a function to a certain arity! <33
curry.to = curry(function(arity, fn) {
    return createFn(fn, [], arity)
})

// num, fn -> fn
//-- adapts a function in the context-first style
//-- to a curried version. <3333
curry.adaptTo = curry(function(num, fn) {
    return curry.to(num, function(context) {
        const args = tail(arguments).concat(context)
        return fn.apply(this, args)
    })
})

// fn -> fn
//-- adapts a function in the context-first style to
//-- a curried version. <333
curry.adapt = function(fn) {
    return curry.adaptTo(fn.length, fn)
}

export default curry
