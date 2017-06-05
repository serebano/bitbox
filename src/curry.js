import is from "./is"
import { getArgNames } from "./utils"
import isPlaceholder from "./internal/isPlaceholder"
import __ from "./operators/__"

const slice = Array.prototype.slice
const has = (key, target) => target && key in target
const isCurried = fn => has("$", fn)
const toArray = a => slice.call(a)
const tail = a => slice.call(a, 1)

function getNextArgs(args, received, length) {
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
    return { args, received, combined, done: left <= 0, left, length }
}

function camelize(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase()
        })
        .replace(/\s+/g, "")
}

const fnName = (arr, argNames, sep = "_") =>
    arr
        .map(
            (arg, idx) =>
                isPlaceholder(arg)
                    ? `__${argNames[idx]}__`
                    : is.func(arg) ? arg.name : !is.complexObject(arg) ? arg : argNames[idx]
        )
        .join(sep)

export function createFn(fn, args, length, descMap = {}) {
    const argNames = fn.argNames

    function createProxy(received) {
        const next = getNextArgs([], received, length)

        function f() {}
        f.next = next
        f.argNames = fn.argNames
        f.expectedLen = length - received.length
        f.received = received
        f.map = fn.map

        f.toString = () => {
            const name = camelize(`${fn.name} ${fnName(next.combined, argNames, " ")}`)
            const lArgs = argNames.slice(length - received.length + 1).join(", ") //argNames.slice(received.filter(a => !isPlaceholder(a)).length).join(", ")
            return `function ${name}(${lArgs}) {}`
        }

        const proxy = new Proxy(f, {
            apply(target, context, args) {
                const next = getNextArgs(args, received, length)

                if (next.done) return fn.apply(context, next.combined)
                return createProxy(next.combined)
            },
            get(target, key) {
                if (key === "desc") return descMap
                if (key === "args") return received
                if (key === "length") return length - received.length
                if (key === "$") return target
                if (key === "name") return camelize(`${fn.name} ${fnName(received, argNames, " ")}`)
                //if (key === Symbol.toPrimitive || key === "toString") return f.toString

                // if (key === Symbol.toPrimitive)
                //     return () => {
                //         const next = getNextArgs(args, received, length)
                //         const rArgs = received
                //             .map((arg, idx) => (isPlaceholder(arg) ? `__${argNames[idx]}` : String(arg)))
                //             .join(", ")
                //         const lArgs = argNames.slice(received.filter(a => !isPlaceholder(a)).length).join(", ")
                //         return `curry(function ${target.name}(${argNames.join(", ")}) [${length}])(${rArgs})(${lArgs})`
                //     }
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

    return createProxy(args, args)
}

function curry(fn, ...args) {
    // if (isCurried(fn)) {
    //     const { target, argNames, descMap, length } = fn.$
    //     const xDesc = Object.assign({}, descMap, desc)
    //     const args = Object.values(xDesc)
    //
    //     return createFn(target, args, length - args.length, xDesc)
    // }

    fn.argNames = fn.argNames || getArgNames(fn)
    fn.args = new Array(fn.length).fill(__)
    fn.map = fn.argNames.reduce((obj, key, idx) => {
        if (args[idx]) fn.args[idx] = args[idx]
        obj[key] = value => c(...fn.args.slice().splice(idx, 1, value))
        return obj
    }, {})
    const c = createFn(fn, args, fn.length, {})

    return c
    // const map = argNames.reduce((obj, key, idx) => {
    //     if (args[idx]) obj[key] = args[idx]
    //     return obj
    // }, {})

    //const args = argNames.map(name => descMap[name]) //Object.values(descMap)
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
    for (var i = 0; i < len; i += 1) a.push("a" + i.toString())
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

export default curry
