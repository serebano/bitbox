export default function({ state, props, object, array }) {

	const count = array(
		state`app.count`,
		props`count`,
		(a=0, b=1) => a + b
	)

 	const nums = [1, 2, 3, 4, 5, (...nums) => nums.reduce((n, x) => n + x), String]

	return object({
		name: state`app.name`,
		color: props`color`,
		fullName: [
			state`user.firstName`,
			state`user.lastName`,
			(first, last) => `${first} ${last}`
		],
		nums,
		count,
		func: (obj) => Object.keys(obj).length
	})

}
