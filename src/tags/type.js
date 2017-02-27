import Tag from '../Tag'

export default (type) => {
	return (keys, ...values) => {
    	return new Tag(type, keys, values)
	}
}
