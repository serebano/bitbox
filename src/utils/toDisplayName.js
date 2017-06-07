import is from "../is"

export default (names = [], values) =>
    (values ? values.map((value, index) => `${names[index] || index}=${value}`) : names).join(", ")
