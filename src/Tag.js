import get from "./model/get";

export default class Tag {
    hasPath = true;

    constructor(type, keys, values) {
        this.type = type;
        this.keys = keys;
        this.values = values;
    }
    resolve(target) {
        const model = this.type.split(".").reduce((obj, key) => obj[key], target);
        if (!model) throw new Error(`Invalid model ${this.type} in context`);
        return model;
    }
    /*
      Gets the path of the tag, where nested tags are evaluated
    */
    path(context, full) {
        if (!context) throw new Error("You can not grab the path from a Tag without context");

        if (!this.hasPath) throw new Error(`Tag "${this.type}" does not have path`);

        let path = Array.isArray(this.keys)
            ? this.keys.reduce(
                  (path, key, idx) => {
                      const value = this.values[idx];
                      if (value instanceof Tag) return path + key + value.get(context);
                      return path + key + (value || "");
                  },
                  ""
              )
            : this.keys;

        if (path && path.indexOf(".") === 0 && context.props && context.props.root)
            path = context.props.root + path;

        return full
            ? path && path !== "." ? this.type + "." + path : this.type
            : path && path !== "." ? path : "";
    }

    get(context, view) {
        const model = this.resolve(context);

        if (model.get) return model.get(this.path(context), view);

        return get(model, this.path(context), view);
    }

    model(context, extend) {
        const target = this.resolve(context);
        if (!target) throw new Error(`Invalid ${this.type} in context`);

        return Object.assign(
            {},
            target,
            {
                path: this.path(context, true)
                //context
            },
            extend
        );
    }

    paths(context, types) {
        return this.tags(types).filter(tag => tag.hasPath).map(tag => tag.path(context, true));
    }

    tags(types) {
        const match = !types || !types.length || types.indexOf(this.type) > -1;

        return (match ? [this] : []).concat(
            this.keys.reduce(
                (paths, k, index) => {
                    const value = this.values[index];
                    return value instanceof Tag ? paths.concat(value.tags(types)) : paths;
                },
                []
            )
        );
    }

    /*
      Produces a string representation of the path
    */
    pathToString() {
        if (typeof this.keys === "string") return this.keys;

        return this.keys.reduce(
            (currentPath, string, idx) => {
                const valueTemplate = this.values[idx];

                if (valueTemplate instanceof Tag)
                    return currentPath + string + "${ " + valueTemplate.toString() + " }";

                return currentPath + string + (valueTemplate || "");
            },
            ""
        );
    }

    /*
      Produces a string representation of the tag
    */
    toString() {
        return this.type + "`" + this.pathToString() + "`";
    }
}
