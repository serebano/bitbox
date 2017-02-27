import { inc, set } from '../../operators'

export default function Counts(mod, {state,props}) {
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
		}
	}
}
