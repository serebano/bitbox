import is from "../is"

export default (names = [], values = []) => values.map((value, index) => `${names[index] || index}=${value}`).join(", ")
