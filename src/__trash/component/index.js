import View from 'react'
import {compute} from '../tags'

export default function connectComponent(dependencies, Component) {

	const target = compute(dependencies)

	class Wrapper extends View.Component {
		componentWillMount () {

			this.connection = this.context.store.connect(target, (changes) => {
				const newPaths = this.context.store.paths(target, this.props)
				this.connection.update(newPaths)

				this.forceUpdate()
			})

			console.log(`${Component.name} connected`, this.connection)
		}

		componentWillUnmount () {
	    	this._isUnmounting = true
			this.connection.remove()
	    }

		shouldComponentUpdate () {
			return false
		}

		render() {
			return View.createElement(Component, this.context.store.get(target, this.props))
		}

	}

	Wrapper.displayName = `${Component.displayName || Component.name}_Wrapper`

	Wrapper.contextTypes = {
  		store: View.PropTypes.object
	}

	return Wrapper
}
