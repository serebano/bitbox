const COMPUTE_TYPE = Symbol(`type/compute`)

export default class Tag {

    static templates = {}

    static template(type, handlers) {
        Tag.templates[type] = (strings, ...values) => {
            return new Tag(type, Object.assign({}, handlers), strings, values)
        }
        Tag.templates[type].type = type
        Tag.templates[type].handlers = handlers

        return Tag.templates[type]
    }

    static compose(factory) {
        return factory(Tag.templates, Tag.compute)
    }

    static compute(...args) {
        const get = args.pop()

        return new Tag(COMPUTE_TYPE, {
            get(context) {
                const tags = this.tags()
                const values = tags.map(tag => tag.get(context))

                return get(...values)
            }
        }, args.map((_,i) => i), args)
    }

    /*
      Extracts value from object using a path
    */
    static extract(target, path) {
        return path.split('.').reduce((currentValue, key, index) => {
            if (index > 0 && currentValue === undefined)
                throw new Error(`A tag is extracting with path "${path}", but it is not valid`)

            return key === "" ? currentValue : currentValue[key]
        }, target)
    }

    constructor(tag, handlers, strings, values) {
        this.type = tag
        this.handlers = handlers
        this.strings = strings
        this.values = values
    }

    /*
      Returns all tags, also nested to identify nested state dependencies
      in components
    */
    tags(self) {
        return this.strings.reduce((paths, string, index) => {
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

        return this.strings.reduce((currentPath, string, idx) => {
            const valueTemplate = this.values[idx]

            if (valueTemplate instanceof Tag)
                return currentPath + string + valueTemplate.get(context)

            if (valueTemplate && valueTemplate.getValue)
                return currentPath + string + valueTemplate.getValue(context)

            return currentPath + string + (valueTemplate || '')
        }, '')
    }

    /*
      Uses the path of the tag to look it up in related getter
    */
    get(context) {
        if (!context)
            throw new Error('You can not grab a value from a Tag without getters')

        if (COMPUTE_TYPE === this.type)
            return this.handlers.get.call(this, context)

        const target = context[this.type]
        const handler = this.handlers.get

        if (handler && !target)
            throw new Error(`Tag of type ${this.type.toUpperCase()} can not be used in this context`)

        if (!handler)
            return this.path(context)

        return handler.call(this, target, this.path(context))
    }

    set(context, value) {
        if (!context)
            throw new Error('You can not grab a value from a Tag without getters')

        const target = context[this.type]
        const handler = this.handlers.set

        if (!handler)
            throw new Error(`Tag of type ${this.type.toUpperCase()} does not provide set handler`)

        if (value instanceof Tag)
            return handler.call(this, target, this.path(context), value.get(context))

        if (typeof value === "function")
            return handler.call(this, target, this.path(context), value(this.get(context)))

        return handler.call(this, target, this.path(context), value)
    }

    /*
      Produces a string representation of the path
    */
    pathToString() {
        return this.strings.reduce((currentPath, string, idx) => {
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
