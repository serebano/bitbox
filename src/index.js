import bitbox from "./bitbox";
import * as operators from "./operators";
import { is } from "./utils";
//import * as mapping from "./examples/mapping";
//import "./examples";
import * as one from "./examples/one";

export default bitbox;

Object.assign(window, operators, {
    is,
    bitbox,
    operators
});

Object.assign(window, one);
