import React from 'react'
import Component from './Component'

export const Foo = Component(
	function({ props, state }) {
		return {
			pColor: props`color`,
			data: [
				state`app`,
				{
					fullName: [
						state`app.firstName`,
						state`app.lastName`,
						(f,l) => f + " " + l
					]
				},
				(app,user) => {
					return { ...app, user }
				}
			]
		}
	},
	function Foo(props) {
		console.log(`Foo`, props)
	}
)

export const Counter = Component(
	function({ props, state, signal }) {
		return {
			count: state `.count`,
			color: state `.color`,
			inc: signal `.increment`,
			dec: signal `.decrement`
		}
	},
	function Count({count,color,inc,dec}) {
		return (
			<div style={{ background:'#eee', padding:16, margin: 8 }}>
				<h1 style={{color}}>Count: {count}</h1>
				<button onClick={() => inc()}>Increment</button>
				<button onClick={() => dec()}>Decrement</button>
			</div>
		)
	}
)

export const Name = Component(
	function({ state, signal, compute }) {
		return {
			name: compute(state`app.name`, name => String(name).toUpperCase()),
			nameChanged: signal`app.nameChanged`
		}
	},
	function Name({ name, nameChanged }) {
		return (
			<section>
				<h1>#{name}</h1>
				<input type="text" value={name} onChange={(e) => nameChanged({name:e.target.value})} />
			</section>
		)
	}
)

export default Component(
	({ props, state }) => {
		return {
			name: state`app.name2`
		}
	},
	function App({name}) {
		return (
			<section>
				<Name />
				<Counter count={7} />
			</section>
		)
	}
)
