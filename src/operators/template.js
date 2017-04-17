function template(strings, ...keys) {
    function operator(...values) {
        const dict = values[values.length - 1] || {};
        const result = [strings[0]];
        keys.forEach((key, i) => {
            const value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join("");
    }
    operator.displayName = `template \`${templateString(strings, keys)}\``;

    return operator;
}

function templateString(strings, keys) {
    return [strings[0], ...keys.map(key => `\${${key}}`)].join("");
}

export default template;
