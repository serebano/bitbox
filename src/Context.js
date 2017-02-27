import Tag from './Tag'

export class Context {
	constructor(props) {
		this.props = props || {}
	}
}

function ContextFactory(...providers) {

	function run(action, props, done) {

		const context = run.providers.reduce((context, Provider) => {
			if (Provider(context, ...arguments) !== context)
				throw new Error(`Provider(${Provider.name}) must return context`)

			return context
		}, new Context(props))

		if (action instanceof Tag)
			return context.get(action)

		return typeof action === "function"
			? action(context, done)
			: context
	}

	run.providers = providers

	return run
}

export default ContextFactory
