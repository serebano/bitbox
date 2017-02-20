import Tag from './Tag'
//import state from './handlers/state'
//import props from './handlers/props'
import string from './handlers/string'
import compute from './handlers/compute'
import observe from './handlers/observe'

const props = observe('props', (path, value) => {
	console.log(`(props)`, path, '=', value)
})

const state = observe('state', (path, value) => {
    console.info(`(state)`, path, '=', value)
})

Object.assign(window, Tag.templates)

const context = {
    state: {
        app: {
            name: 'Falcon'
        }
    },
    props: {
        color: 'red'
    }
}


const comp = compute({
    name: state`app.name`,
    color: props`color`
})

window.str = string`name: ${state`app.name`}, color: ${props`color`}`

state`app.str`.set(context, string`
    App name: ${state`app.name`},
    Props color: ${props`color`}
`)

window.comp = comp
window.context = context
window.tag = Tag
