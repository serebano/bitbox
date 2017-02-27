export default (target) => {
    return function increment(context) {
        const value = context.get(target)

        return context.set(target, (value || 0) + 1)
    }
}
