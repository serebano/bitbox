import is from "./is"
import factory from "./factory"
import resolve from "./resolve"
import compose from "./compose"
import curry from "./curry"
import view from "./view"
/**
 * [GET] box.one({ one: 1 }) -> 1
 * [SET] box.one({ one: 1 }, 2) -> 2
 * [SET] box({ one: 1 }).one++ -> 2
 * [MOD] box(observable, is.observable)({ one: 1 })
 *
 * @param  {Array}
 * @return {Function}
 */

function path(path, ...args) {
    const [target, ...rest] = args
    if (is.func(target)) {
        const lastArg = args[args.length - 1]
        const viewMap = is.object(lastArg) && args.pop()
        viewMap && args.push(view(viewMap))
        return factory(compose(...args, curry((path, target) => resolve(target, path))), path) //factory(box, path.concat(target, ...args))
    }
    if (is.promise(target)) return target.then(target => resolve(target, path, ...rest))

    return resolve(target, path, ...rest)
}

export default factory(path)
