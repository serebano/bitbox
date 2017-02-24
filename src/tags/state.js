import Tag from '../Tag'

export class StateTag extends Tag {

    constructor(keys, values) {
        super("state")
        this.keys = keys
        this.values = values
    }

    get(context) {
        return this.extract(context.store.module, this.path(context))
    }
    set(context, value) {
        const path = this.path(context)
        const resolved = this.resolve(context, value)
        this.update(context.store.module, path, resolved)

        return true
    }
}

function state(keys, ...values) {
    return new StateTag(keys, values)
}

export default state



// state.provider = store => context => {
//     context.state = state.resolve(store.module)
//     return context
// }
//
// state.resolve = (context) => {
//     return {
//         get: (path) => state.get(context, path),
//         set: (path, value) => state.set(context, path, value)
//     }
// }
//
// state.get = (context, path) => {
//     const value = Tag.extract(context.state, path)
//
//     return value
// }
//
// state.set = (context, path, value) => {
//     const keys = path.split(".")
//     const key = keys.pop()
//
//     if (!key)
//         context.state = value
//     else
//         Tag.extract(context.state, keys)[key] = value
//
//     return true
// }
