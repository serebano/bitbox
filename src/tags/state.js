import Tag from '../Tag'

const {cache} = Tag

class State extends Tag {}
state.Tag = State

function state(keys, ...values) {
    return new State("state", {
        get(context) {
            const path = this.path(context)
            const value = Tag.extract(context.store.module.state, path)
            cache.set(this.type, path, value)

            return value
        },
        set(context, value) {
            const path = this.path(context)
            const target = context.store.module
            const keys = path.split(".")
            const key = keys.pop()

            if (!key)
                target.state = value
            else
                Tag.extract(target.state, keys)[key] = value

            cache.set(this.type, path, value)

            return true
        }

    }, keys, values)
}

export default state
