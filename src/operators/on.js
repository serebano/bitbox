export default function on(target, fn) {
    //const entity = (changes) => listener(store.get(target), changes)
    //entity.toString = () => `store.on(${target}, ${listener})`

    return function on(context) {
        return context.store.on(target, fn)
    }
}
