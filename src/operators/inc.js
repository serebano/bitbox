export default (target, value = 1) => {

    function inc(context) {
        const model = context.model(target)

        model.set(null, model.get(null, (state = 0) => {
            return state + context.resolve.value(value)
        }))
    }

    return inc
}
