export const placeholder = Symbol.for("functional/placeholder")

export const isPlaceholder = arg => typeof arg === "function" && arg[placeholder] === true

function defaultTo(value, target) {
    return target == null || target !== target ? value : target
}

function __(fn, ...args) {
    //if (typeof fn !== "function") fn = arg => defaultTo(fn, arg)

    const fx = arg => (isPlaceholder(arg) ? __(fn(arg, ...args)) : fn(arg, ...args))

    fx.toString = () => `__(${fn})`
    fx[placeholder] = true

    return fx
}

__.toString = () => `__`
__[placeholder] = true

export default __
