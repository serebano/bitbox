import React from 'react'
import {render} from 'react-dom'
import Container from '../component/container'
import Component from '../component'
import Store from '../store'
import { set, inc, dec } from '../operators'

function CounterModule({ state, props }) {
	return {
		state: {
			count: 0,
			color: 'magenta'
		},
		signals: {
			colorChanged: [
				set(state`counter.color`, props`color`)
			],
			increment: [
				inc(state`counter.count`, 7)
			],
			decrement: [
				dec(state`counter.count`, 9)
			]
		}
	}
}

const CounterComponent = Component(
	function({ props, state, signal, path }) {
		return {
			count: state`${path.deep}.count`,
			color: state`${path.deep}.color`,
			inc: signal`counter.increment`,
			dec: signal`counter.decrement`
		}
	},
	function({ count, color, inc, dec }) {
		return (
			<div style={{ background:'#eee', padding:16, margin: 8 }}>
				<h1 style={{color}}>Count: {count}</h1>
				<button onClick={() => inc()}>Increment</button>
				<button onClick={() => dec()}>Decrement</button>
			</div>
		)
	}
)

const store = Store(CounterModule)

render((
	<Container store={store}>
    	<CounterComponent />
	</Container>
), document.querySelector('#root'))
