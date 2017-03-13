export default (target) => {
    return (context) => {
        context.model(target).remove()
    }
}
