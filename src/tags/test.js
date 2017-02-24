import Tag from '../Tag'

class MyTag extends Tag {}

function test(keys, ...values) {
	return new MyTag('path', {
		get(context) {
			return this.path(context)
		}
	}, keys, values)
}

export default test
