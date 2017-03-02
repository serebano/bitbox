import { inc, set } from '../../operators'

function Counts({ store, path }, { state, props, signal }) {
	return {
		state: {
			name: 'Demo store',
			counter: 'foo',
			counts: {
				foo: 1,
				bar: 1
			}
		},
		signals: {
			countClicked: [
				inc(state`.counts.${state`.counter`}`)
			],
			colorChanged: [
				set(state`.color`, props`color`)
			]
		},
		provider(context) {
			return context
		}
	}
}

export default Counts
