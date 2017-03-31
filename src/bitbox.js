import { isObservable } from "./observer";
import Map from "./map";
import Compute from "./compute";
import path from "./path";
import { observe, observable } from "./observer";
import * as operators from "./operators";

export { default as is } from "./is";
export { default as bit } from "./bit";
export { default as box } from "./box";
export { default as run } from "./run";
export { default as map } from "./map";
export { default as path } from "./path";
export { default as compute } from "./compute";
export { default as component } from "./views/react";

export { observe, observable, operators };

export const github = path(path =>
    fetch(`https://api.github.com/${path.join("/")}`).then(res => res.json()));

export const state = path(null, ["state"]);
