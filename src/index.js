import Tag from './Tag'
//import state from './handlers/state'
import props from './handlers/props'
import string from './handlers/string'
import observe from './handlers/observe'


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

const state = observe('state', function(path, value) {
    console.info(path, '=', value)
})

const comp = Tag.compute(
    state`app.name`,
    props`color`,
    function(name, color) {
        return {
            name,
            color
        }
    }
)

window.str = string`name: ${state`app.name`}, color: ${props`color`}`

state`app.str`.set(context, string`
    App name: ${state`app.name`},
    Props color: ${props`color`}
`)

window.comp = comp
window.observe = observe
window.state = state
window.props = props
window.string = string
window.context = context
window.tag = Tag
