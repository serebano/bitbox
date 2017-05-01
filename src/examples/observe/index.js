import bitbox from "../../bitbox"
import React from "react"
import ReactDOM from "react-dom"

const render = node => ReactDOM.render(node, document.querySelector("#root"))
const counter = props => <button onClick={() => props.count++}>{props.count}</button>

bitbox.observe({ count: 0 }, counter, render)
