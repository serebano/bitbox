import is from "./is"
import { getArgNames } from "./utils"
import isPlaceholder from "./internal/isPlaceholder"
import __ from "./operators/__"
import has from "./operators/has"

const slice = Array.prototype.slice
const isCurried = fn => fn && has("$", fn)

const toArray a => slice.call(a)
tail(a)  => slice.call(a, 1))

export function createFn(fn, args, length, descMap = {}) {
    function createProxy(received) {
        const proxy = new Proxy(fn, {
            apply(target, context, args) {
                let left = length
                let combined = []
                let argsIdx = 0
                let resIdx = 0
                while (resIdx < received.length || argsIdx < args.length) {
                    let result
                    if (resIdx < received.length && (!isPlaceholder(received[resIdx]) || argsIdx >= args.length)) {
                        result = received[resIdx]
                    } else {
                        result = args[argsIdx]
                        argsIdx += 1
                    }
                    combined[resIdx] = result
                    if (!isPlaceholder(result)) left -= 1
                    resIdx += 1
                }

                //combined.map((arg, index) => (argsMap[index] = arg))

                if (left <= 0) return target.apply(context, combined)
                return createProxy(combined)
            },
            get(target, key) {
                if (key === "desc") {
                    return descMap
                }
                if (key === "args") return received
                // if (key === "extend")
                //     return desc => {
                //         const o = Object.assign({}, argsMap, desc)
                //         console.log(`extend`, o, received)
                //         return createFn(fn, received, length, o)
                //     }
                if (key === "length") return length - received.length
                // if (argNames.indexOf(key) > -1) {
                //     return arg => {
                //         argsMap[key] = arg
                //         return createProxy(received)
                //     }
                // }
                if (key === "$") return { target, length, descMap, argNames: Object.keys(descMap), received }
                if (key === Symbol.toPrimitive) return () => `${target.name}(${Object.keys(descMap).join(", ")})`
                if (is.numeric(key)) return received[key]

                //if (key === "toJSON")
                //    return () => `${target.name}(${argNames.map((arg, idx) => `${arg}: ${received[idx]}`).join(", ")})`
                if (Reflect.has(target, key)) return Reflect.get(target, key)
            },
            has(target, key) {
                return Object.keys(descMap).indexOf(key) > -1
            }
        })

        return proxy
    }

    return createProxy(args)
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

function processInvocation(fn, argsArr, totalArity) {
    argsArr = trimArrLength(argsArr, totalArity)

    if (argsArr.length === totalArity) return fn.apply(null, argsArr)
    return createFn(fn, argsArr, totalArity)
}

function curry(fn, desc) {
    if (isCurried(fn)) {
        const { target, argNames, descMap, length } = fn.$
        const xDesc = Object.assign({}, descMap, desc)
        const args = Object.values(xDesc)

        return createFn(target, args, length - args.length, xDesc)
    }

    const argNames = getArgNames(fn)
    const descMap = argNames.reduce((obj, key, idx) => {
        if (has(key, desc)) obj[key] = desc[key]
        return obj
    }, {})

    const args = argNames.map(name => descMap[name]) //Object.values(descMap)

    return createFn(fn, args, fn.length, descMap)
}

/*
    byKey = curry(
        (key, val, obj) => obj[key] = val(obj[key]),
        [__, add(100), __]
        {
            val: add(100),
            obj: __
        }
    )

    byKeyX = curry(
        byKey,
        {
            key: 'xxx',
            val: arg('xValue', is.string(or(eroor)), toUpper)
        }
    )

*/


curry.to = curry(function(arity, fn) {
    return createFn(fn, [], arity)
})

curry.adaptTo = curry(function(num, fn) {
    return curry.to(num, function(context) {
        const args = tail(arguments).concat(context)
        return fn.apply(this, args)
    })
})

//-- adapts a function in the context-first style to
curry.adapt = function(fn) {
    return curry.adaptTo(fn.length, fn)
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

export default curry
