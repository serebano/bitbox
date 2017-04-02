import { observe, observable, observers, proxies } from "./observer";
import * as operators from "./operators";
import * as bits from "./bits";

export { default as bit } from "./bit";

export { default as box } from "./box";
export { default as run } from "./run";
export { default as map } from "./map";
export { default as path } from "./path";
export { default as compute } from "./compute";
export { default as component } from "./views/react";
export { default as is } from "./utils/is";

export { bits, observe, observable, operators, observers, proxies };

import "./example";
