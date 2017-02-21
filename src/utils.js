export function ensureStrictPath (path, value) {
  if (isComplexObject(value) && path.indexOf('*') === -1) {
    return `${path}.**`
  }

  return path
}
export function cleanPath (path) {
  return typeof path === 'string' ? path.replace(/\.\*\*|\.\*/, '') : path
}

export function isObject (obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

export function isComplexObject (obj) {
  return typeof obj === 'object' && obj !== null
}
function extractAllChildMatches (children) {
  return Object.keys(children).reduce((matches, key) => {
    if (children[key].children) {
      return matches.concat(children[key]).concat(extractAllChildMatches(children[key].children))
    }

    return matches.concat(children[key])
  }, [])
}

export function dependencyMatch (changes, dependencyMap) {
  let currentMatches = []

  for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
    let currentDependencyMapLevel = dependencyMap
    for (let pathKeyIndex = 0; pathKeyIndex < changes[changeIndex].path.length; pathKeyIndex++) {
      if (!currentDependencyMapLevel) {
        break
      }

      if (currentDependencyMapLevel['**']) {
        currentMatches.push(currentDependencyMapLevel['**'])
      }

      if (pathKeyIndex === changes[changeIndex].path.length - 1) {
        const dependency = currentDependencyMapLevel[changes[changeIndex].path[pathKeyIndex]]
        if (dependency) {
          currentMatches.push(dependency)

          if (dependency.children) {
            if (changes[changeIndex].forceChildPathUpdates) {
              currentMatches = currentMatches.concat(extractAllChildMatches(dependency.children))
            } else {
              if (dependency.children['**']) {
                currentMatches.push(dependency.children['**'])
              }

              if (dependency.children['*']) {
                currentMatches.push(dependency.children['*'])
              }
            }
          }
        }

        if (currentDependencyMapLevel['*']) {
          currentMatches.push(currentDependencyMapLevel['*'])
        }
      }

      if (!currentDependencyMapLevel[changes[changeIndex].path[pathKeyIndex]]) {
        currentDependencyMapLevel = null
        break
      }

      currentDependencyMapLevel = currentDependencyMapLevel[changes[changeIndex].path[pathKeyIndex]].children
    }
  }

  return currentMatches
}
