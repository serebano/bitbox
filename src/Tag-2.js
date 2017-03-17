import Model from "./Model-2";

class Tag {
    static isTag(arg) {
        return arg instanceof Tag;
    }

    static create(type) {
        return (keys, ...values) => new Tag(type, keys, values);
    }

    constructor(type, keys, values) {
        this.type = type;
        this.keys = typeof keys !== "undefined" ? [].concat(keys) : [];
        this.values = values;
    }

    resolve(tree, props) {
        const getters = props
            ? Object.assign(
                  {
                      props: props || {}
                  },
                  tree
              )
            : tree;

        if (!getters[this.type]) throw new Error(`Cannot resolve target: ${this.type}`);

        return getters;
    }

    path(tree, props) {
        return this.keys.reduce(
            (path, key, index) => {
                const arg = this.values[index];
                if (arg instanceof Tag) return path + key + arg.value(tree, props);

                return path + key + (arg || "");
            },
            ""
        );
    }

    value(tree, props) {
        const getters = this.resolve(tree, props);
        const path = this.path(tree, props);

        if (Model.isModel(getters[this.type])) {
            return getters[this.type].get(path);
        }

        return path.split(".").reduce((obj, key) => obj[key], getters[this.type]);
    }

    tags(map) {
        const tags = [this].concat(
            this.values.reduce(
                (paths, value) => value instanceof Tag ? paths.concat(value.tags()) : paths,
                []
            )
        );
        return map ? tags.map(map) : tags;
    }
}

export default Tag;
