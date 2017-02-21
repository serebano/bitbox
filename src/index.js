import Tag from './Tag'
//import state from './handlers/state'
//import props from './handlers/props'
import string from './handlers/string'
import compute from './handlers/compute'
import observe from './handlers/observe'
import * as operators from './operators'
import debug from './debug'
import * as utils from './utils'
import DependencyStore from 'cerebral/lib/DependencyStore'

const app = {
	deps: new DependencyStore(),
	changes: []
}


const flush = (force) => {
	const changes = app.changes
	app.changes = []
	let components = []

	if (force) {
    	components = app.deps.getAllUniqueEntities()
    } else {
    	components = app.deps.getUniqueEntities(changes)
    }

	components.forEach((component) => {
	  	component(changes)
	})

	return {changes,components}
}

const run = (...actions) => {
	const result = actions.map(action => action(context))
	const changes = flush()
	return {
		result,
		...changes
	}
}
const props = observe('props', (path, value) => {
	app.changes.push({ type: 'props', path: path.split("."), forceChildPathUpdates: false })
	//console.log(`(props)`, path, '=', value)
})

const state = observe('state', (path, value) => {
	app.changes.push({ type: 'state', path: path.split("."), forceChildPathUpdates: false })
    //console.info(`(state)`, path, '=', value)
})

const context = {
    state: {
        app: {
            name: 'Falcon'
        },
		user: {
			firstName: 'Sergiu',
			lastName: 'Toderascu'
		}
    },
    props: {
        color: 'red',
        count: 1
    }
}


const getDeps = ($, o={}) => {
	return $.values.reduce((obj, tag) => {
		if (tag.type === "state") {
			const path = tag.path(context)
			const strictPath = utils.ensureStrictPath(path, tag.get(context))
			obj[strictPath] = true
		} else if (tag.type === "compute.object" || tag.type === "compute.array") {
			return getDeps(tag, obj)
		}
		return obj
	}, o)
}
function Component(dependencies, component) {
	const deps = compute(dependencies)
	console.log('deps', deps)
	const depsMap = getDeps(deps)
	function updater(changes) {
		component(deps.get(context))
	}

	app.deps.addEntity(updater, depsMap)

	return {
		dependencies, component, deps, depsMap, updater
	}
}

const fooComp = Component({
		data: [
			state`app`,
			{
				fullName: [
					state`user.firstName`,
					state`user.lastName`,
					(f,l) => f + " " + l
				]
			},
			(app,user) => {
				return { ...app, user }
			}
		]
	},
	function Foo(props) {
		console.log(`Foo`, props)
	}
)

const countComp = Component({
		count: state`app.count`,
		color: state`app.color`
	},
	function Count(props) {
		console.log(`Count`, props)
	}
)

const nameComp = Component({
		name: state`app.name`
	},
	function Name(props) {
		console.log(`Name`, props)
	}
)

Object.assign(window, Tag.templates, operators, utils, {getDeps,Component,run,fooComp,countComp,nameComp})


const arr = compute.array([ 1, 2, (a, b) => a + b ])
const obj = compute.object({ arr, app: state`app`, bar: [1,2,3] })
const mix = compute({
    arr: [ 1, 2, (a, b) => a + b ],
    obj: {
        arr: [ 5, 7, (a, b) => a + b ],
        app: state`app`,
        bar: [ 1, 2, 3, 4, props`count`, (...n) => n.reduce((n,x) => x + n) ]
    }
})

const comp = compute({
    name: state`app.name`,
    color: props`color`,
    nestObj: {
        stateCount: state`app.count`,
        propsCount: props`count`
    },
    strType: string`
        App name: ${state`app.name`}
        App count: ${state`app.count`}
        Props color: ${props`color`}
    `
})

const incAction = operators.inc(state`app.count`, props`count`)
const setAction = operators.set(state`app.str2`, props`str2`)


window.incAction = incAction
window.setAction = setAction

window.flush = flush

window.app = app
window.arr = arr
window.obj = obj
window.mix = mix

window.comp = comp
window.context = context
window.tag = Tag

window.$g = (tag) => {
    const result = tag.get(context)
    const json = JSON.stringify(result, null, 4)
    debug({json,tag})
    console.group(tag.type)
    console.log(tag.keys)
    console.log(tag.values)
    console.groupEnd()
    window.hljs.highlightBlock(document.querySelector('pre code'))
    return result
}
