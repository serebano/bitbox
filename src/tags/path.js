import Tag from '../Tag'

function path(keys, ...values) {
	return new Tag('path', {
		get(context) {
			return this.path(context)
		}
	}, keys, values)
}

export default path
