export function concat(...args) {
    function operator(target, ...args) {
        return target.concat(...args)
    }
    operator.args = args
    operator.displayName = `concat(${args.map(String)})`
    return operator
}

export function push(...args) {
    function operator(target, ...args) {
        return target.push(...args)
    }
    operator.args = args
    operator.displayName = `push(${args.map(String)})`
    return operator
}

export function merge(...args) {
    function operator(target, ...args) {
        return Object.assign(target, ...args)
    }
    operator.args = args
    operator.displayName = `merge(${args.map(String)})`
    return operator
}

export function join(separator) {
    function operator(target) {
        return target.join(separator)
    }
    operator.displayName = `join(${separator})`
    return operator
}

export function map(fn, context) {
    function operator(target) {
        return target.map(fn, context)
    }
    operator.displayName = `map(${fn.displayName || fn.name})`
    return operator
}
