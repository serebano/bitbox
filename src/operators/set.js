export default (target, value) => {
    function set(context) {
        context.model(target).set(null, value)
    }

    return set
}
