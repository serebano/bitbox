import View from 'react'
import {compute} from '../tags'

export default function createComponent(dependencies, Component) {

	class Wrapper extends View.Component {

		constructor (props, context) {
  			super(props, context)

			this.tag = compute(dependencies)
			this.deps = this.getDeps(props)
		}

		getContext(props) {
			return this.context.store.run.context({}, Object.assign({}, this.props, props))
		}

		componentWillMount () {
			const update = (changes) => {
				const prevDeps = this.deps

				this.deps = this.getDeps(this.props)
				this.context.store.deps.update(update, prevDeps, this.deps)

				this.forceUpdate()
			}

			update.deps = this.deps
			update.toString = () => `${Component.name}Component`

			this.disconnect = this.context.store.deps.add(update, update.deps)
		}

		componentWillUnmount () {
	    	this._isUnmounting = true
			this.disconnect()
	    }

		shouldComponentUpdate () {
			return false
		}

		getDeps(props) {
			return this.tag.deps(this.getContext(props))
		}

		getProps() {
			return this.tag.get(this.getContext(this.props))
		}

		render() {
			return View.createElement(Component, this.getProps())
		}
	}

	Wrapper.displayName = `${Component.displayName || Component.name}_Wrapper`

	Wrapper.contextTypes = {
  		store: View.PropTypes.object
	}

	return Wrapper
}
