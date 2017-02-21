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
        bar: [1,2,3]
    }
})

const xxx = [
    1,
    [
        obj,
        Object.keys
    ],
    [
        state`app.name`,
        [
            1,
            2,
            3,
            state`app.count`,
            (...ns) => ns.reduce((n,x) => n + x)
        ]
    ],
    {
        props: props``,
        arr: [
            100,
            3,
            (a,b) => a+b
        ]
    },
    state`app`,
    (primitive, objKeys, deepArray, objArr, appTag) => {
        return {primitive, objKeys, deepArray, objArr, appTag}
    }
]

function assign() {
    return [
        ...arguments,
        (...values) => Object.assign({}, ...values)
    ]
}

window.$g = (tag) => {

    const result = tag.get(context)
    const json = JSON.stringify(result, null, 4)
    debug({json,tag})

    console.group(tag.type)
    console.log(tag.keys)
    console.log(tag.values)
    //console.log(result)
    console.groupEnd()

    window.hljs.highlightBlock(document.querySelector('pre code'))
    return result
}

//compute(assign(state`app`, {cnt:props`count`}, {xxx,arrayFactory}))

function objectFactory($) {
    console.log(`objectFactory`, $)
    return {
        color: $.props`color`,
        name: $.state`app.name`
    }
}

function arrayFactory($) {
    console.log(`arrayFactory`, $)
    return [
        $.props`color`,
        $.state`app.name`
    ]
}

window.objectFactory = objectFactory
window.arrayFactory = arrayFactory

window.assign = assign
window.xxx = xxx
window.arr = arr
window.obj = obj
window.mix = mix

const objects = compute(state`app`, props``, { stateCount: state`app.count`, propsCount: props`count` })


const incAction = operators.inc(state`app.count`, props`count`)
const setAction = operators.set(state`app.str2`, props`str2`)

//(context)
//operators.merge(state`app.merged`, state`app`, props``, { stateCount: state`app.count`, propsCount: props`count` })(context)

const comp = compute({
    name: state`app.name`,
    color: props`color`,
    strType: string`
        App name: ${state`app.name`}
        App count: ${state`app.count`}
        Props color: ${props`color`}
    `
})

window.str = string`name: ${state`app.name`}, color: ${props`color`}`
window.str2 = string`
    App name: ${state`app.name`}
    App count: ${state`app.count`}
    Props color: ${props`color`}
`

window.incAction = incAction
window.setAction = setAction

window.objects = objects
window.comp = comp
window.context = context
window.tag = Tag
