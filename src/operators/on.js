export default function on(target, fn) {
    return function on(context) {
        return context.store.on(target, fn)
    }
}
