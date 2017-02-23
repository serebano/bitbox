import Tag from './Tag'
import * as operators from './operators'
//import * as utils from './utils'
//import debug from './debug'
import store from './app.store'
import tags from './tags'
import './render'
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'
import actionChain from './action'
import * as action from './action/chain'

const controller = Controller({
  // You do not want to run the devtools in production as it
  // requires a bit of processing and memory to send data from
  // your application
  devtools: (
    process.env.NODE_ENV === 'production' ?
      null
    :
      Devtools({
        // If running standalone debugger
        remoteDebugger: 'localhost:8585'
      })
  )
})

//export default controller

Object.assign(window, {action,actionChain,Tag,store,tags,operators,controller}, tags, operators)

//const {state,props,string,compute} = store.tags

// const context = {
//     state: {
//         app: {
//             name: 'Falcon'
//         },
// 		user: {
// 			firstName: 'Sergiu',
// 			lastName: 'Toderascu'
// 		}
//     },
//     props: {
//         color: 'red',
//         count: 1
//     }
// }
//
// Object.assign(window, Tag.templates, operators, utils, {Module})
//
// const arr = compute.array([ 1, 2, (a, b) => a + b ])
// const obj = compute.object({ arr, app: state`app`, bar: [1,2,3] })
// const mix = compute({
//     arr: [ 1, 2, (a, b) => a + b ],
//     obj: {
//         arr: [ 5, 7, (a, b) => a + b ],
//         app: state`app`,
//         bar: [ 1, 2, 3, 4, props`count`, (...n) => n.reduce((n,x) => x + n) ]
//     }
// })
//
// const comp = compute({
//     name: state`app.name`,
//     color: props`color`,
//     nestObj: {
//         stateCount: state`app.count`,
//         propsCount: props`count`
//     },
//     strType: string`
//         App name: ${state`app.name`}
//         App count: ${state`app.count`}
//         Props color: ${props`color`}
//     `
// })
//
// const incAction = operators.inc(state`app.count`, props`count`)
// const setAction = operators.set(state`app.str2`, props`str2`)
//
//
// window.incAction = incAction
// window.setAction = setAction
//
// window.arr = arr
// window.obj = obj
// window.mix = mix
//
// window.comp = comp
// window.tag = Tag
//
// window.$g = (tag) => {
//     const result = tag.get(context)
//     const json = JSON.stringify(result, null, 4)
//     debug({json,tag,context})
//     console.group(tag.type)
//     console.log(tag.keys)
//     console.log(tag.values)
//     console.groupEnd()
//     window.hljs.highlightBlock(document.querySelector('pre code'))
//     return result
// }
