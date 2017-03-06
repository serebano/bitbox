import Store from './Store'
import { set, inc, dec } from './operators'
import { state, props } from './tags'

function App(tags) {

	return {
		state: {
			path: this.path,
			name: 'App',
			color: 'lightgreen'
		},
		signals: {
			nameChanged: [
				set(state`app.name`, props`name`)
			],
			colorChanged: [
				set(state`app.color`, props`color`)
			],
		},
		modules: {
			cone: Counter,
			ctwo: Counter,
			foo: {
				state: {name: 'foo'},
				modules: {
					bar: {
						modules: {
							baz: {
								state: {
									title: 'Bax'
								},
								modules: {
									deep: Counter
								}
							}
						}
					}
				}
			}
		}
	}
}

function Counter({ state, props, path }) {

	const root = path[this.name] = this.path

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
				inc(state`${root}.count`, 7)
			],
			decrement: [
				dec(state`${root}.count`, 9)
			]
		}
	}
}

const store = Store({
	state: {
		x: 3
	},
	modules: {
		app: App,
		counter: Counter,
		counter2: Counter
	}
})
//, Debugger((data, ...args) => { console.log(`(debugger)`, data, args) }), ProxyProvider({ xxx: {a:1,b:2} }))

export default store
