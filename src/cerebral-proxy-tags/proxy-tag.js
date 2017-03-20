import Path from "../Path";

export default class ProxyTag extends Path {
    resolve(context, type) {
        const path = [];

        for (let i = 0; i < this.$$path.length; i++) {
            const value = this.$$path[i];
            if (Path.isPath(value)) {
                path.push(value.get(context));
            } else {
                path.push(value);
            }
        }
        return type ? [this.type].concat(path) : path;
    }

    getPaths(func) {
        const path = func ? func(this) : this;
        const paths = path ? [path] : [];
        for (let i = 0; i < this.$$path.length; i++) {
            const value = this.$$path[i];
            if (Path.isPath(value)) return paths.concat(value.getPaths(func));
        }
        return paths;
    }
}
