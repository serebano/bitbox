import {inc,set} from '../operators'
import {state,props,compute,path,signal} from '../tags'

function iAmAnAction () {
  return new Promise((resolve) => {
    resolve({
      newProp: 'someValue'
    })
  })
}

function action1(ctx) {
	state`${path.deep}.count`.set(ctx, state`${path.deep}.count`.get(ctx) + props`n`.get(ctx))
	return {
		a1: 1,
		p: props``.get(ctx)
	}
}

function actionPromise(ctx) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve({ resolvedPromise: Date() })
		}, 5000)
	})
}


function action2() {
	return action22
}

function action22(ctx, x) {
	props`fromA2`.set(ctx, Date())
	console.log('a22', x, ctx.props)

	return action3
}

function action3({store,props}) {
	store.set(state`app.name`, props.fromA2)
	return {
		a2: 2,
		dePath: store.path(state`${path.deep}`)
	}
}

const chain = [
	compute({
		deep: state`${path.deep}`,
		signal: signal`app.nameChanged`
	}),
	actionPromise
]

export default [
	action1,
    iAmAnAction,
    chain,
    action2,
    compute({ a: state`app`, b: state`${path.deep}` }),
    ctx => {
		console.log('ctx -> props', ctx.props)
	}
]
