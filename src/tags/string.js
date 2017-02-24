import Tag from '../Tag'

string.tag = class string extends Tag {
	get(context) {
		return this.path(context)
	}
}

function string(keys, ...values) {
	return new string.tag('string', {}, keys, values)
}

export default string
