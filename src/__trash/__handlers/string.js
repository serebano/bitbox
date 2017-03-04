import Tag from '../Tag'

export default function() {
	return function string(keys, ...values) {
		return new Tag('string', {
			resolve(context) {
				return this.path(context)
			}
		}, keys, values)
	}
}
