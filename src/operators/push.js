export default (target, ...args) => {
    return function push(context) {
        context.model(target).push(null, ...args)
    }
}
