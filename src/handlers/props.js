import tag from '../Tag'

export default tag.template('props', {
    get(context, path) {
        return this.extract(context, path)
    },
    set(context, path, value) {
        const keys = path.split(".")
        const key = keys.pop()
        const target = this.extract(context, keys)

        target[key] = value
    }
})
