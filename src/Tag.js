export default class Tag {

    static templates = {}

    static template(type, handlers) {
        if (typeof type === "function") {
            Tag.templates[type.name] = type
            Tag.templates[type.name].handlers = handlers

            return Tag.templates[type.name]
        }

        Tag.templates[type] = function(keys, ...values) {
            return new Tag(type, handlers, keys, values)
        }

        Tag.templates[type].handlers = handlers

        return Tag.templates[type]
    }

    static compose(factory) {
        return factory(Tag.templates)
    }

    /*
      Extracts value from object using a path
    */
    static extract(target, path) {
        const keys = !Array.isArray(path)
            ? path.split('.')
            : path

        return keys.reduce((result, key, index) => {
            if (index > 0 && result === undefined)
                throw new Error(`A tag is extracting with path "${path}", but it is not valid`)

            return key === "" ? result : result[key]
        }, target)
    }

    constructor(tag, handlers, keys, values) {
        this.type = tag
        this.handlers = handlers
        this.keys = keys
        this.values = values
    }

    /*
      Returns all tags, also nested to identify nested state dependencies
      in components
    */
    tags(self) {
        return this.keys.reduce((paths, string, index) => {
            return this.values[index] instanceof Tag
                ? paths.concat(this.values[index])
                : paths
        }, self ? [ this ] : [])
    }

    /*
      Gets the path of the tag, where nested tags are evaluated
    */
    path(context) {
        if (!context)
            throw new Error('You can not grab the path from a Tag without context')

        return this.keys.reduce((currentPath, string, idx) => {
            const valueTemplate = this.values[idx]

            if (valueTemplate instanceof Tag)
                return currentPath + string + valueTemplate.get(context)

            if (valueTemplate && valueTemplate.getValue)
                return currentPath + string + valueTemplate.getValue(context)

            return currentPath + string + (valueTemplate || '')
        }, '')
    }

    get(context) {
        if (!context)
            throw new Error('You can not grab a value from a Tag without getters')

        if (this.handlers.resolve)
            return this.handlers.resolve.apply(this, arguments)

        const target = context[this.type]
        const handler = this.handlers.get

        if (!target)
            throw new Error(`Tag of type ${this.type.toUpperCase()} can not be used in this context`)

        if (!handler)
            throw new Error(`Tag of type ${this.type.toUpperCase()} does not provide get handler`)

        return handler.call(this, context, this.path(context))
    }

    set(context, value) {
        if (!context)
            throw new Error('You can not grab a value from a Tag without getters')

        const target = context[this.type]
        const handler = this.handlers.set

        if (!target)
            throw new Error(`Tag of type ${this.type.toUpperCase()} can not be used in this context`)

        if (!handler)
            throw new Error(`Tag of type ${this.type.toUpperCase()} does not provide set handler`)

        if (value instanceof Tag)
            return handler.call(this, context, this.path(context), value.get(context))

        if (typeof value === "function")
            return handler.call(this, context, this.path(context), value(this.get(context)))

        return handler.call(this, context, this.path(context), value)
    }

    extract(context, path) {
        return Tag.extract(context[this.type], path)
    }

    target(context) {
        return context[this.type]
    }

    /*
      Produces a string representation of the path
    */
    pathToString() {
        return this.keys.reduce((currentPath, string, idx) => {
            const valueTemplate = this.values[idx]

            if (valueTemplate instanceof Tag)
                return currentPath + string + '${' + valueTemplate.toString() + '}'

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
