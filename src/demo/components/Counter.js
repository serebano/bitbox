import React from 'react'
import component from '../../Component'

export default component(function({ state, props, signal }) {
	return {
		id: state`counter`,
		count: state`counts.${state`counter`}`,
		color: props`color`,
		countClicked: signal`countClicked`
	}
}, function Counter(props) {
	return (
		<h2 style={{color:props.color||"#333"}}>
			Count({props.id}): {props.count||0}
			<hr />
			<button onClick={ () => props.countClicked() }>Increment</button>
		</h2>
	)
})
