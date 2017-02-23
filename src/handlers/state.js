import Tag from '../Tag'

export default function State(tags) {
    const cache = Tag.cache

    function state(keys, ...values) {
        return new Tag("state", {

            isStateDependency: true,

            get(context) {
                const path = this.path(context)
                const value = this.extract(context, path)
                cache.set(this.type, path, value)

                return value
            },

            set(context, value) {
                const path = this.path(context)

                cache.delete(this.type, path)

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

    return state
}
