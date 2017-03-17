import { render } from "react-dom";
import { Component } from "../../views/react";

import store from "./store";
import app from "../components/app";

render(Component(app, store), document.querySelector("#root"));
