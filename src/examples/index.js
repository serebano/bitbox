import Inferno from "inferno"
import component from "../views/inferno"
import App from "./components/app"
import app from "./app"
import createStore from "./createStore"
import appStore from "./store"

export const store = createStore(appStore)
export { app, appStore }

Inferno.render(component(App, store, app), document.querySelector("#root"))
