import Inferno from "inferno"
import component from "../views/inferno"
import createStore from "./createStore"
import App from "./components/app"
import app from "./app"
import appStore from "./store"

const store = createStore(appStore)

export { app, store }
//component.debug = true

Inferno.render(component(App, store, app), document.querySelector("#root"))
