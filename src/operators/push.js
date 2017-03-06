export default (target, ...args) => {
    return (context) => {
        context.model(target).push(null, ...args)
    }
}
