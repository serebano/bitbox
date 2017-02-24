import Tag from './Tag'

function ContextFactory(...providers) {

	function Context(action, ...args) {
		const context = Context.providers.reduce((context, Provider) => {
			if (Provider(context, action, ...args) !== context)
				throw new Error(`Provider(${Provider.name}) must return context`)

			return context
		}, {})

		if (action instanceof Tag)
			return action.get(context)

		return typeof action === "function"
			? action(context, ...args)
			: context
	}

	Context.providers = providers

	return Context
}

export default ContextFactory
