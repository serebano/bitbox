export function assign(...args) {
    function operator(target, args) {
        return Object.assign(target, ...args)
    }

    operator.args = args

    return operator
}
