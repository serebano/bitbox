import compute from "./compute";
import is from "../utils/is";
import { set } from "../handler";
import { observable } from "../observer";

export class Project {
    static isProject = arg => arg instanceof Project;

    constructor(mapping, target) {
        if (!is.object(mapping) || !is.object(target))
            throw new Error(`bitbox.project mapping and target must be type of object`);

        return new Proxy(
            Object.keys(mapping).reduce(
                (map, key) => {
                    if (is.box(mapping[key])) map[key] = mapping[key]();
                    else if (is.compute(mapping[key])) map[key] = mapping[key];
                    else if (is.function(mapping[key])) map[key] = mapping[key](target);
                    else if (is.array(mapping[key])) map[key] = compute(...mapping[key]);
                    else if (is.object(mapping[key])) map[key] = new Project(mapping[key], target);

                    return map;
                },
                this
            ),
            {
                get(map, key, receiver) {
                    if (key === "$") return map;
                    const value = Reflect.get(map, key, receiver);
                    if (is.box(value) || is.compute(value)) return value(target);
                    return value;
                },
                set(map, key, value, receiver) {
                    const box = Reflect.get(map, key, receiver);
                    if (is.box(box)) return box(set, value, target);
                    return Reflect.set(map, key, value);
                }
            }
        );
    }
}

export default function project(map) {
    return function get(target, key, obj) {
        return new Project(map, observable(is.undefined(key) ? target : target[key]));
    };
}
