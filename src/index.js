import Tag from "./Tag";
import Model from "./Model";
import Store from "./Store";

import * as tags from "./tags";
import * as operators from "./operators";
import * as models from "./models";

//import redux from "./examples/redux/store";
//import "./examples/redux";
//import "./examples/demo/model";
import "./examples/counter";

Object.assign(window, { Tag, Model, Store, tags, operators, models }, tags, operators);
