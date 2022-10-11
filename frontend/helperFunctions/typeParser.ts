// Interfaces
import { ATRecord, CludoIndexElement } from '../interfaces';

//Airtable Blocks
import { FieldType, Field } from '@airtable/blocks/models';

//Helper Functions
import { arrayOfObjectsToString } from './arrayHelpers'

/**
 * Converts a list of Airtable Records (ATRecord[]) to a list of CludoIndexElement[]
 * @param  {ATRecord[]} recordList //Records extracted from the Airtable table
 * @param  {Field[]} visibleFields //Fields present in the selected Airtable table
 * @returns {CludoIndexElement[]} A list of CludoIndexElement, in the format to be pushed to Cludo's API
 */
function recordListConverter(recordList: ATRecord[], visibleFields: Field[]): CludoIndexElement[] {
  return recordList.map((rec: ATRecord): CludoIndexElement => {
    return singleRecordConverter(rec, visibleFields);
  });
}

/**
 * Converts a single Airtable Record (ATRecord) to a CludoIndexElement iterating 
 * through each of the columns in the table (ATField[])
 * @param  {ATRecord} atRecord
 * @param  {ATField[]} visibleFields
 * @remarks Title, Description and Url are required fields when adding a new document to Cludo's indexes.
 */
function singleRecordConverter(atRecord: ATRecord, visibleFields: Field[]): CludoIndexElement {
  const newCludoRecord: CludoIndexElement = {
    Title: '',
    Description: '',
    Url: '',
    valid: false, //default is false until validation
    id: atRecord.id
  };
  visibleFields.forEach((field: Field) => {
    //getCellValue retrieves the value of a cell matching the Record or row passed (atRecord) and Field or column (field.name)
    if (atRecord.getCellValue(field.name)) {
      switch (field.name.toLowerCase()) { //Makes Url, title and description case insensitive (avoids failures because they are required)
      case "url":
        newCludoRecord["Url"] = convertContentType(atRecord.getCellValue(field.name), field.type).toString()
        break;
      case "title":
        newCludoRecord["Title"] = convertContentType(atRecord.getCellValue(field.name), field.type).toString()
        break;
      case "description":
        newCludoRecord["Description"] = convertContentType(atRecord.getCellValue(field.name), field.type).toString()
        break;
      default:
        newCludoRecord[addSuffix(field.name,field.type)] = convertContentType(atRecord.getCellValue(field.name), field.type)
        break;
      }
    }
  })
  //We add one more property: "valid" if the minimun constraints to index the new document are passed.
  if (newCludoRecord.Title && newCludoRecord.Description && newCludoRecord.Url) {
    newCludoRecord["valid"] = true
  }
  return newCludoRecord;
}

/**
 * Parses Airtable Field types into Cludo's API push content endpoint supported types.
 * @param  {any} cellValue //Content of the cell in the Table
 * @param  {FieldType} ATfieldType //Content of the cell in the Table
 * @returns Content of the cell in a valid data type (string or number for now) to be pushed through CLUDO's API
 */
function convertContentType(cellValue: any, ATfieldType: FieldType): (string | number) {
  switch (ATfieldType) {
  case FieldType.BARCODE: //Object with the form {text: "xxx", ..} ---> returns text only
    return cellValue.text

  case FieldType.BUTTON: //Object with the form {label: "xxx", url: "xxx", ...}
    return (cellValue.label + " - " + cellValue.url)

  case FieldType.CHECKBOX: //Boolean
    return cellValue.toString()

  case FieldType.CREATED_BY: //These are all Objects Object with the form {email: "xxx", ...} ---> returns email only
  case FieldType.LAST_MODIFIED_BY:
  case FieldType.SINGLE_COLLABORATOR:
    return cellValue.email

  case FieldType.EXTERNAL_SYNC_SOURCE: //These are all Objects with the form {name: "xxx", ...} ---> returns name only
  case FieldType.SINGLE_SELECT:
    return cellValue.name
  case FieldType.MULTIPLE_COLLABORATORS://These are all Objects of type Array<T> ---> returns string of type "{...},{...},{...}""
  case FieldType.MULTIPLE_ATTACHMENTS:
  case FieldType.MULTIPLE_LOOKUP_VALUES:
  case FieldType.MULTIPLE_RECORD_LINKS:
  case FieldType.MULTIPLE_SELECTS:
    return arrayOfObjectsToString(cellValue)
  default: //Rest of cases are already in string, number or date format which is supported by Cludo's API
    return cellValue
  }
}

/**
 * Checks if the data type is Date or number and adds the corresponding suffix to the object attribute aligning with ES types.
 * @param  {string} fieldName //Name of the field before adding the suffix
 * @param  {FieldType} ATfieldType //Airtable field type
 * @returns the name of the field to be imported to ES with the suffix
 */
function addSuffix(fieldName: string, ATfieldType: FieldType): string {

  switch (ATfieldType) {
  case FieldType.CREATED_TIME:
  case FieldType.DATE:
  case FieldType.DATE_TIME:
  case FieldType.LAST_MODIFIED_TIME:
    return (fieldName + "_date");
  case FieldType.DURATION:
  case FieldType.NUMBER:
  case FieldType.CURRENCY:
  case FieldType.COUNT:
  case FieldType.AUTO_NUMBER:
  case FieldType.PERCENT:
  case FieldType.RATING:
    return (fieldName + "_number");
  default:
    return fieldName;
  }
}

export { recordListConverter };