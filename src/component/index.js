import View from 'react'
import {compute} from '../tags'

export default function component(dependencies, Component) {

	class Wrapper extends View.Component {

		constructor (props, context) {
  			super(props, context)

			this.tag = compute(dependencies)
			this.map = this.getDeps(props)
		}

		getContext(props) {
			return this.context.store.run.context({}, Object.assign({}, this.props, props))
		}

		componentWillMount () {
			this.context.store.deps.register(this, this.map)
		}

		componentWillUnmount () {
	    	this._isUnmounting = true
			this.context.store.deps.remove(this, this.map)
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

		_update(changes) {
			const prevMap = this.map
			this.map = this.getDeps(this.props)
			this.context.store.deps.update(this, prevMap, this.map)

			this.forceUpdate()
		}

		render() {
			return View.createElement(Component, this.getProps())
		}

		toJSON () {
			return Component.displayName || Component.name
		}
	}

	Wrapper.displayName = `${Component.displayName || Component.name}_Wrapper`

	Wrapper.contextTypes = {
  		store: View.PropTypes.object
	}

	return Wrapper
}
