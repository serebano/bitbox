import { isObservable } from "./observer";
import Map from "./map";
import Path from "./path";
import Compute from "./compute";

export { default as is } from "./is";
export { default as bit } from "./bit";
export { default as box } from "./box";
export { default as run } from "./run";

export { default as get } from "./operators/get";
export { default as set } from "./operators/set";
export { default as unset } from "./operators/unset";
export { default as reset } from "./operators/reset";
export { default as merge } from "./operators/merge";
export { default as push } from "./operators/push";
export { default as pop } from "./operators/pop";
export { default as concat } from "./operators/concat";
export { default as unshift } from "./operators/unshift";
export { default as inc } from "./operators/inc";
export { default as wait } from "./operators/wait";

export { default as component } from "./views/react";
import * as observer from "./observer";

export { observer };

export function compute(...args) {
    return new Compute(...args);
}
