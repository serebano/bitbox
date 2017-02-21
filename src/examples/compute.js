import tag from '../Tag'

export default function({state,props,compute}) {

	const count = compute(state`app.count`, props`count`, (a=0, b=1) => a + b)

	const compmap = compute({
		name: state`app.name`,
		color: props`color`,
		fullName: [
			state`user.firstName`,
			state`user.lastName`,
			(first, last) => `${first} ${last}`
		]
	})

	return {
		compmap,
		count
	}

}
