import Tag from 'cerebral/lib/tags/Tag'

//import App from './components/App'
Tag.create = (...args) => new Tag(...args)

export default Tag

window.tag = Tag
