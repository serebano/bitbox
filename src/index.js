import React from "react";
import { render } from "react-dom";
import { Container } from "./views/react";
//import store from "./examples/counter/store";
//import App from "./examples/counter/App";

import * as tags from "./tags";
import * as operators from "./operators";
import { compose } from "./tags";
import Tag from "./Tag";
import Model from "./model";
import * as models from "./models";

import Store from "./Store";
import redux from "./examples/redux/store";
import "./examples/redux";
import "./examples/model";

Object.assign(window, { redux, models, Tag, Model, Store }, tags, operators);

// render(
//     <Container store={redux}>
//         <App />
//     </Container>,
//     document.querySelector("#root")
// );
