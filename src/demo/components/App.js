import React from 'react'
import component from '../../Component'
import Name from './Name'
import Counter from './Counter'

export default component(({ state }) => ({
	color: state`color`,
}), function App({ color }) {
	return (
		<section>
			<Name />
			<Counter color={color} />
		</section>
	)
})
