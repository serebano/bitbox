import Compute from "./compute";
import is from "../utils/is";
import Path from "../path";
import { $set } from "./set";
/**
 *  app = bit(target, { count: bit.state.count, name: bit.state.name })
 *  box(() => console.log(app.count, app.name))
 *
 *  app.count++
 */

class Project {
    static isProject = arg => arg instanceof Project;

    constructor(target, object) {
        if (!is.object(object)) throw new Error(`bit.map argument#1 must be an object`);

        const project = Object.keys(object).reduce(
            (map, key) => {
                if (is.path(object[key])) {
                    map[key] = object[key];
                    map[key][Path.isRoot] = true;
                } else if (
                    is.compute(object[key]) || is.project(object[key]) || is.function(object[key])
                )
                    map[key] = object[key];
                else if (is.array(object[key])) map[key] = Compute(...object[key]);
                else if (is.object(object[key])) map[key] = new Project(target, object[key]);

                return map;
            },
            this
        );

        return new Proxy(project, {
            get(map, key, receiver) {
                const res = Reflect.get(map, key, receiver);

                if (key === "$") return map;
                if (is.path(res)) return res(target);
                if (is.compute(res)) return res(target);
                if (is.project(res)) return res;

                return res;
            },
            set(map, key, value, receiver) {
                const entry = Reflect.get(map, key, receiver);

                if (is.path(entry)) return entry($set, value, target);

                return true;
            }
        });
    }
}

export default Project;
