export default (target, ...args) => {
    return (context) => {
        context.model(target).concat(null, ...args)
    }
}
