/** @jsx h */
import bitbox from "../bitbox"
import component from "../views/inferno"
import Inferno from "inferno"
//import ReactDOM from "react-dom"
import { compute, join, or, inc, set } from "../operators"
import store, { root, props, state, signals, args, foo, deep, count, app } from "./app"
import Count from "./components/count"

const render = Inferno.render
component.debug = true
//component.observe = true

export { root, props, state, signals, args, foo, deep, count, app, store, component }

export function App(props, h) {
    return (
        <div>
            <Count />
            <Demo id={props.id} />
        </div>
    )
}

App.map = {
    id: state.id,
    foo: foo(Object.keys)
}

export function Demo(props, h) {
    return (
        <div>
            <h2>{props.name}</h2>
            <h3 style={{ color: props.color }}>Count = {props.count}</h3>
            <input onInput={e => props.name = e.target.value} value={props.name} />
            <button onClick={() => props.count++}>Inc(+)</button>
            <button onClick={() => props.count--}>Dec(-)</button>
        </div>
    )
}

Demo.map = {
    name: state.name,
    count: foo.count,
    color: state.color(or("blue"))
}

setInterval(() => {
    foo(store).count++
    //bitbox.set(store, foo.count, foo.count(inc))
}, 1)

render(component(App, store), document.querySelector("#root"))
