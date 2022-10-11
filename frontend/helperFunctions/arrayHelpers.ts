/**
 * @param  {T[]} array
 * @returns an string representing the array flattened to the 1 elvel
*/
function arrayOfObjectsToString<T>(array: Array<T>) : string {
  return array.map(obj => JSON.stringify(obj)).flat(1).toString()
}

/**
 * @param  {T[]} array
 * @param  {T} element
 * @returns {T[]} the same array with the the element removed (if It was already contained) or
 * added if the element wasn't in the array already
*/
function toggleElementInArray<T>(array: Array<T>, element: T): Array<T> {
  const exists = array.includes(element)
  if (exists) {
    return array.filter((c) => { return c !== element })
  } else {
    const result = array
    result.push(element)
    return result
  }
}

export {arrayOfObjectsToString, toggleElementInArray};