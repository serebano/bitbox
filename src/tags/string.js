import Tag from '../Tag'

function string(keys, ...values) {
	return new Tag('string', {
		get(context) {
			return this.path(context)
		}
	}, keys, values)
}

export default string
