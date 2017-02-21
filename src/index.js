import Tag from './Tag'
//import state from './handlers/state'
//import props from './handlers/props'
import string from './handlers/string'
import compute from './handlers/compute'
import observe from './handlers/observe'
import * as operators from './operators'
import debug from './debug'

const props = observe('props', (path, value) => {
	console.log(`(props)`, path, '=', value)
})

const state = observe('state', (path, value) => {
    console.info(`(state)`, path, '=', value)
})

Object.assign(window, Tag.templates, operators)

const context = {
    state: {
        app: {
            name: 'Falcon'
        }
    },
    props: {
        color: 'red',
        count: 1
    }
}

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
