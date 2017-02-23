import {ensureStrictPath} from './utils'

export default class Tag {
    /*
      Extracts value from object using a path
    */
    static extract(target, path) {
        const keys = !Array.isArray(path)
            ? path.split('.')
            : path

        return keys.reduce((result, key, index) => {
            if (index > 0 && result === undefined) {
                console.log(`ext`, {target})
                throw new Error(`A tag is extracting with path "${path}/${key}[${index}]", but it is not valid`)
            }
            return key === "" ? result : result[key]
        }, target)
    }

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

    static cache = {
        index: {},
        keys(type) {
            return this.index[type] && Object.keys(this.index[type])
        },
        has(type, path) {
            return this.index[type] && (path in this.index[type][path])
        },
        get(type, path) {
            return this.index[type] && this.index[type][path]
        },
        set(type, path, value) {
            if (!this.index[type])
                this.index[type] = {}

            this.index[type][path] = value
        },
        delete(type, path) {
            return this.index[type] && (delete this.index[type][path])
        },
        clear(type) {
            return delete this.index[type]
        }
    }

    constructor(type, handlers, keys, values) {
        this.type = type
        this.handlers = handlers
        this.keys = keys
        this.values = values
    }

    deps(context) {
        const canChange = (tag) => typeof tag.handlers.set === "function"

        return this.tags(canChange(this))
            .reduce((map, tag) => {
                if (canChange(tag)) {
                    const path = tag.path(context)
                    const value = tag.get(context)
                    const strictPath = ensureStrictPath(path ? (tag.type + "." + path) : tag.type, value)

                    map[strictPath] = true
                } else {
                    return Object.assign(map, tag.deps(context))
                }

                return map
            }, {})
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

        if (typeof this.keys === 'string')
            return this.keys

        return this.keys.reduce((path, key, idx) => {
            const value = this.values[idx]

            if (value instanceof Tag)
                return path + key + value.get(context)

            return path + key + (value || '')
        }, '')
    }

    get(context) {
        if (!context)
            throw new Error('You can not grab a value from a Tag without getters')

        if (typeof context === "function") {
            const tag = this
            return function get(ctx) {
                return context(tag.get(ctx))
            }
        }

        const handler = this.handlers.resolve
            ? this.handlers.resolve
            : this.handlers.get

        if (!handler)
            throw new Error(`Tag of type ${this.type.toUpperCase()} does not provide get handler`)

        const cached = Tag.cache.get(this.type, this.path(context))

        if (cached) {
            Tag.emit('get:cached', this, context, cached)

            return cached
        }

        const value = handler.call(this, context)

        Tag.emit('get', this, context, value)

        return value
    }

    set(context, value) {
        if (!context)
            throw new Error('You can not grab a value from a Tag without getters')

        const handler = this.handlers.set

        if (!handler)
            throw new Error(`Tag of type ${this.type.toUpperCase()} does not provide set handler`)

            if (context instanceof Tag)
                return ctx => {
                    const value = context.get(ctx)
                    this.set(ctx, value)

                    //return { value, path: this.path(ctx) }
                }

            if (typeof context === "function")
                return ctx => {
                    const value = context(ctx)
                    this.set(ctx, value)

                    //return { value, action: context, path: this.path(ctx) }
                }

        if (typeof value === "function")
            return this.set(context, value.call(this, context))

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
        if (this.handlers.string)
            return this.handlers.string.call(this)

        return this.type + '`' + this.pathToString() + '`'
    }
}
