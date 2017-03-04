export default (target, value) => {
    function unset(context) {
        context.apply(target, function unset(target, key) {
            delete target[key]
        })
    }

    return unset
}
