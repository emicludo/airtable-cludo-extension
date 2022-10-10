/**
 * @param  {T[]} array
 * @returns an string representing the array flattened to the 1 elvel
*/
function arrayOfObjectsToString<T>(array: Array<T>) : string {
  return array.map(obj => JSON.stringify(obj)).flat(1).toString()
}


function toggleElementInArray<T>(array: Array<T>, name: T): Array<T> {
  const exists = array.includes(name)
  if (exists) {
    return array.filter((c) => { return c !== name })
  } else {
    const result = array
    result.push(name)
    return result
  }
}

export {arrayOfObjectsToString, toggleElementInArray};