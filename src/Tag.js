import {extractFrom} from './utils'

export default class Tag {

    static extract(context, path) {
        if (!context)
            throw new Error('You can not grab a value from a Tag without getters')

        return extractFrom(context, path)
    }

    static update(context, path, value) {
        const root = path.split(".")
        const key = root.pop()

        if (!root.length)
            return (context[key] = value)

        const target = Tag.extract(context, root)

        target[key] = value

        return target[key]
    }

    static resolve(context, value, next) {
        if (value instanceof Tag)
            return value.resolve
                ? Tag.resolve(context, value.resolve(context), next)
                : Tag.resolve(context, value.get(context), next)

        if (value instanceof Promise)
            return value.then(result => Tag.resolve(context, result, next))

        return next
            ? next(value)
            : Promise.resolve(value)
    }

    constructor(type, keys, values) {
        this.type = type
        this.keys = keys
        this.values = values
    }

    paths(context) {
        const canChange = (tag) => typeof tag.set === "function"

        return this.tags(canChange(this))
            .reduce((map, tag) => {
                if (canChange(tag)) {
                    map.push(tag.path(context, true))
                } else {
                    return map.concat(tag.paths(context))
                }

                return map
            }, [])
    }

    /*
      Returns all tags, also nested to identify nested state dependencies
      in components
    */
    tags(self) {
        return this.values.reduce((paths, value, index) => {
            return value instanceof Tag
                ? paths.concat(value)
                : paths
        }, self ? [ this ] : [])
    }

    /*
      Gets the path of the tag, where nested tags are evaluated
    */
    path(context, full) {
        if (!context)
            throw new Error('You can not grab the path from a Tag without context')

        let path = Array.isArray(this.keys)
            ? this.keys.reduce((path, key, idx) => {
                const value = this.values[idx]
                if (value instanceof Tag)
                    return path + key + value.get(context)
                return path + key + (value || '')
            }, '')
            : this.keys

        if (path && path.indexOf('.') === 0 && context.props && context.props.root)
            path = context.props.root + path

        return full
            ? path && path !== "."
                ? this.type + "." + path
                : this.type
            : path && path !== "."
                ? path
                : ""
    }

    get(context) {
        return Tag.extract(context, this.path(context, true))
    }

    /*
      Produces a string representation of the path
    */
    pathToString() {
        if (typeof this.keys === 'string')
            return this.keys

        return this.keys.reduce((currentPath, string, idx) => {
            const valueTemplate = this.values[idx]

            if (valueTemplate instanceof Tag)
                return currentPath + string + '${ ' + valueTemplate.toString() + ' }'

            return currentPath + string + (valueTemplate || '')
        }, '')
    }

    /*
      Produces a string representation of the tag
    */
    toString() {
        return this.type + '`' + this.pathToString() + '`'
    }
}
