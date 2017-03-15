import Store from '../Store'
import init from './modules'

const store = Store(init)

// store.set(module`foo.amod`, function(mod) {
// 	return {
// 		state: {
// 			x: 0,
// 			y: 0
// 		},
// 		signals: {
// 			xx: [
// 				set(state`.x`, Date.now()),
// 				state`.x`
// 			]
// 		},
// 		provider(context, action, props) {
// 			context.getAmod = (tag) => {
// 				context.props.root = mod.path
// 				return context.get(tag)
// 			}
// 			return context
// 		}
// 	}
// })
//
// store.set(signal`foo.amod.yy`, [
// 	set(state`.repo`, github`repos.serebano.fun`),
// 	state`.repo`
// ])

//store.connect(state`**`, state => console.log('state:', state))

export default store
