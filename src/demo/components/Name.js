import React from 'react'
import component from '../../Component'

export default component(function({ state }) {
	return {
		name: state`name`
	}
}, function Name({ name }) {
	return <h1>{name||"..."}</h1>
})
