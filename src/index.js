import React from "react";
import { render } from "react-dom";
import { Container } from "./Component";
//import store from "./examples/counter/store";
//import App from "./examples/counter/App";

import * as tags from "./tags";
import * as operators from "./operators";
import Model from "./model";
import Store from "./Store";
import redux from "./examples/redux/store";
import "./examples/redux";
import "./examples/model";

Object.assign(window, { redux, Model, Store }, tags, operators);

// render(
//     <Container store={store}>
//         <App />
//     </Container>,
//     document.querySelector("#root")
// );
