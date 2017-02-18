import Tag from 'cerebral/lib/tags/Tag'

//import App from './components/App'
Tag.create = (...args) => new Tag(...args)
Tag.create2 = (...args) => new Tag(...args)

export default Tag

window.tag = Tag
