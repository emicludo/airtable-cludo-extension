import { CludoIndexElement } from "../interfaces";

/**
 * @param  {CludoIndexElement} object
 * @returns {CludoIndexElement} a CludoIndexElement without the valid property
 */
function removeValidandId(object: CludoIndexElement) : CludoIndexElement {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const {valid, ...newObject } = object
  return newObject;
}

export {removeValidandId};