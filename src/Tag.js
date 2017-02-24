import {cleanPath,Cache,extractFrom} from './utils'

export default class Tag {


    static Context = class TagContext {}

    /*
      Extracts value from object using a path
    */
    static cache = Cache()

    static extract = extractFrom

    static observers = {}

    static observe(type, fn) {
        const key = type.name||type

        if (!Tag.observers[key])
            Tag.observers[key] = []

        const index = Tag.observers[key].push(fn) - 1

        return function remove() {
            return Tag.observers[key].splice(index, 1)
        }
    }

    static emit(handler, tag, context, details) {
        const observers = Tag.observers[tag.type]

        if (observers && observers.length)
            observers.forEach(fn => {
                fn(handler, tag, context, details)
            })
    }

    constructor(type, handlers, keys, values) {
        this.type = type
        this.handlers = handlers
        this.keys = keys
        this.values = values
    }

    paths(context) {
        const canChange = (tag) => typeof this.set === "function"

        return this.tags(canChange(this))
            .reduce((map, tag) => {
                if (canChange(tag)) {
                    const path = tag.path(context, false)
                    map.push(path && path !== "." ? (tag.type + "." + path) : tag.type)
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
        return this.keys.reduce((paths, string, index) => {
            return this.values[index] instanceof Tag
                ? paths.concat(this.values[index])
                : paths
        }, self ? [ this ] : [])
    }

    /*
      Gets the path of the tag, where nested tags are evaluated
    */
    path(context, clean = true) {
        if (!context)
            throw new Error('You can not grab the path from a Tag without context')

        const path = typeof this.keys === 'string'
            ? this.keys
            : this.keys.reduce((path, key, idx) => {
                const value = this.values[idx]
                if (value instanceof Tag)
                    return path + key + value.get(context)
                return path + key + (value || '')
            }, '')

        return clean
            ? cleanPath(path)
            : path
    }

    get(context) {
        if (!context)
            throw new Error('You can not grab a value from a Tag without getters')


        return this.extract(context, this.path(context))

        // if (typeof context === "function") {
        //     const tag = this
        //     return function get(ctx) {
        //         return context(tag.get(ctx))
        //     }
        // }

        // const handler = this.handlers.resolve
        //     ? this.handlers.resolve
        //     : this.handlers.get
        //
        // if (!handler)
        //     throw new Error(`Tag of type ${this.type.toUpperCase()} does not provide get handler`)
        //
        // const cached = Tag.cache.get(this.type, this.path(context))
        //
        // if (cached) {
        //     Tag.emit('get:cached', this, context, cached)
        //
        //     return cached
        // }
        //
        // const value = handler.call(this, context)
        //
        // Tag.emit('get', this, context, value)
        //
        // return value
    }

    resolve(context, value, next) {
        if (context instanceof Tag)
            return (ctx) => this.resolve(ctx, context, next)

    	if (value instanceof Tag)
            return this.resolve(context, value.get(context), next)

        if (value instanceof Promise)
            return value.then(result => this.resolve(context, result, next))

    	if (typeof value === "function")
            return this.resolve(context, value(context), next)

    	return next ? next(value) : value
    }

    _set(context, value) {
        if (!context)
            throw new Error('You can not grab a value from a Tag without getters')

        const handler = context.set

        if (!handler)
            throw new Error(`Tag of type ${this.type.toUpperCase()} does not provide set handler`)

        if (context.set)
            return context.set(this, value)

        if (context instanceof Tag)
            return (ctx) => ctx.set(this, ctx.get(context))

        if (typeof context === "function")
            return (ctx) => ctx.set(this, context(ctx))

        if (context.set)
            return context.set(this, value)

        if (typeof value === "function")
            return this.set(context, value(context))

        if (value instanceof Tag) {
            const resolved = value.get(context)
            const result = handler.call(this, context, resolved)

            if (result)
                Tag.emit('set', this, context, resolved)

            return result
        }

        const result = handler.call(this, context, value)

        if (result)
            Tag.emit('set', this, context, value)

        return result
    }

    extract(context, path) {
        return Tag.extract(context[this.type], path)
    }

    update(target, path, value) {
        const root = path.split(".")
        const key = root.pop()
        if (!key)
            return (target[this.type] = value)

        const object = this.extract(target, root)
        return (object[key] = value)
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
        //if (this.handlers.string)
        //    return this.handlers.string.call(this)

        return this.type + '`' + this.pathToString() + '`'
    }
}
