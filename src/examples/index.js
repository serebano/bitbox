import { render } from "inferno"
import component from "../views/inferno"
import App from "./components/app"
import app from "./app"
import store from "./store"

export { app, store }

//component.debug = true

render(component(App, store, app), document.querySelector("#root"))
