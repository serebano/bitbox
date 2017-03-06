export default (target, value) => {

    function inc(context) {
        const model = context.model(target)

        model.set(null, model.get(null, (state = 0) => {
            return state + context.resolve.value(value || 1)
        }))
    }

    return inc
}
