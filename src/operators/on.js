export default function on(target) {
    //const entity = (changes) => listener(store.get(target), changes)
    //entity.toString = () => `store.on(${target}, ${listener})`

    return function paths(context) {
        return target.paths(context)
    }
}
