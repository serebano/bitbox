import View from 'react'
import Tag from '../Tag'

export default function component(connect, Component) {

	const depsMap = Tag.compose(connect)
	const deps = Tag.compose(({compute}) => compute.object(depsMap))

	return class Wrapper extends View.Component {

		static component = Component
		static depsMap = depsMap
		static deps = deps

		constructor (props, context) {
  			super(props, context)
		}

		componentWillMount () {
			this.context.registerComponent(this, depsMap)
		}
		componentWillUnmount () {
	    	this._isUnmounting = true
			this.context.unregisterComponent(this, depsMap)
	    }
		shouldComponentUpdate () {
			return false
		}
		createContext(props) {
			return {
				state: this.context.state,
				props: props
			}
		}
		getDeps(props) {
			const context = this.createContext(props)
			return deps.tags().map(tag => tag.path(context))
		}
		getProps() {
			const context = this.createContext(this.props)
			return deps.get(context)
		}
		_update(props) {
			const nextDepsMap = this.getDeps(props)
			this.context.updateComponent(this, nextDepsMap)
			this.forceUpdate()
		}
		render() {
			return View.createElement(Component, this.getProps())
		}
	}
}
