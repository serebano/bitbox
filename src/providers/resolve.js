export default function resolve(context) {
	context.resolve = {
		path(target) {
			return target.path(context)
		},
		value(target) {
			return target.get(context)
		},
		paths(target) {
			return target.paths(context)
		},
		state(target) {
			return context.store.module
		},
		props(target) {
			return context
		}
	}

	return context
}
