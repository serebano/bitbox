import tag from '../Tag'

const handlers = {
    resolve(context) {
        if (!this.keys) {
            return this.values.reduce((result, value, index) => {
				if (value instanceof tag)
					return result.concat(value.get(context))

				if (typeof value === "function")
					return Array.isArray(result)
						? value(...result)
						: value(result)

				return result
			}, [])
		}

        return this.keys.reduce((obj, key, idx) => {
            const value = this.values[idx]

            obj[key] = (value instanceof tag)
                ? value.get(context)
                : typeof value === "function"
					? value(obj)
					: value

            return obj
        }, {})
    }
}

function compute(args) {
    if (arguments.length === 1 && typeof args === "object") {
        const keys = Object.keys(args)
		const values = keys.map(key => args[key])

		return new tag('compute', handlers, keys, values)
    }

	return new tag('compute', handlers, undefined, Array.from(arguments))
}


export default tag.template(compute, handlers)
