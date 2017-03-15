import { props, state } from '../../tags'
import { set, inc } from '../../operators'

export default {
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
			inc(state`counts.${state`counter`}`)
		],
		colorChanged: [
			set(state`color`, props`color`)
		]
	},
	modules: {
		foo: {
			state: {
				count: 1
			},
			provider(context, action) {
				context.getFoo = () => context.state
				return context
			}
		},
		bar(mod) {
			return {
				state: {
					name: 'Barr',
					count: 2
				},
				provider(context, action) {
					context.getBar = () => mod
					return context
				}
			}
		}
	}
}
