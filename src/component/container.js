import View from 'react'

class Container extends View.Component {
    getChildContext() {
        if (!this.props.store)
            throw new Error('You are not passing store to Container')

        return {
			store: this.props.store
		}
    }
    render() {
        return this.props.children
    }
}

Container.propTypes = {
	store: View.PropTypes.object.isRequired,
	children: View.PropTypes.node.isRequired
}

Container.childContextTypes = {
	store: View.PropTypes.object.isRequired
}

export default Container
