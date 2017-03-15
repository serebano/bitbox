import { inc } from '../../operators'
import { state } from '../../tags'

function Counts({ name, path }) {
	return {
		state: {
			name: 'Demo store',
			moduleName: name,
			modulePath: path,
			counter: 'foo',
			counts: {
				foo: 1,
				bar: 1
			}
		},
		signals: {
			countClicked: [
				inc(state`${path}.counts.${state`${path}.counter`}`)
			]
		},
		provider(context) {
			return context
		}
	}
}

export default Counts
