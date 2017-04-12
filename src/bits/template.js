function templateString(strings, keys) {
    return [strings[0], ...keys.map(key => `\${${key}}`)].join("");
}

function template(strings, ...keys) {
    function getter(...values) {
        const dict = values[values.length - 1] || {};
        const result = [strings[0]];
        keys.forEach((key, i) => {
            const value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join("");
    }

    getter.displayName = `template\`${templateString(strings, keys)}\``;

    return getter;
}

export default template;
