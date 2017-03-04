export default (target, value) => {
    function set(context) {
        context.apply(target, 'set', value)
    }

    return set
}
