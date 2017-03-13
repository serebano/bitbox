export default function(store) {
    return function StateProvider(context) {
		let asyncTimeout

        if (context.debugger) {
            context.state = Object.assign({}, store.state, {
				onChange(e) {
	                context.debug({
	                    type: 'mutation',
	                    method: e.method,
	                    args: [ e.path.slice(1), ...e.args ]
	                })

	                clearTimeout(asyncTimeout)
	                asyncTimeout = setTimeout(() => store.changes.commit())
				}
            })
        } else {
			context.state = Object.assign({}, store.state, {
				onChange(e) {
					clearTimeout(asyncTimeout)
					asyncTimeout = setTimeout(() => store.changes.commit())
				}
			})
		}

        return context
    }
}
