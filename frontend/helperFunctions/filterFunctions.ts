import { CludoIndexElement } from "../interfaces";

/**
 * @param  {CludoIndexElement} object
 * @returns a CludoIndexElement without valid and id properties
 */
function removeValidandId(object: CludoIndexElement) : CludoIndexElement {
  // eslint-disable-next-line no-unused-vars
  const {valid, id, ...newObject } = object
  return newObject;
}

export {removeValidandId};