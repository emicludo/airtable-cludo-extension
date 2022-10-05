// Interfaces
import { ATRecord, ATField, CludoIndexElement } from '../interfaces';

//Airtable Blocks
import { FieldType } from '@airtable/blocks/models';

/**
 * Converts a list of Airtable Records (ATRecord[]) to CludoIndexElement[] )
 * @param  {ATRecord[]} recordList //Records extracted from the Airtable table
 * @param  {ATField[]} visibleFields //Fields present in the selected Airtable table
 */
function recordListConverter(recordList: ATRecord[], visibleFields: ATField[]) : CludoIndexElement[] {
  return recordList.map((rec: ATRecord) : CludoIndexElement => {
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
function singleRecordConverter(atRecord: ATRecord, visibleFields: ATField[]) : CludoIndexElement {
  const newCludoRecord: CludoIndexElement = {
    Title: '' ,
    Description: '',
    Url: '',
    valid: false,
    id: atRecord.id
  };
  visibleFields.forEach((field: ATField) => {
    //getCellValue retrieves the value of a cell matching the Record or row passed (atRecord) and Field or column (field.name)
    if (atRecord.getCellValue(field.name)){ 
      switch (field.name.toLowerCase()) { //Makes Url, title and description case insensitive (avoids failures because they are required)
        case "url":
          newCludoRecord["Url"] = convertContentType(atRecord.getCellValue(field.name),field.type).toString()
          break;
        case "title":
          newCludoRecord["Title"] = convertContentType(atRecord.getCellValue(field.name),field.type).toString()
          break;
        case "description":
          newCludoRecord["Description"] = convertContentType(atRecord.getCellValue(field.name),field.type).toString()
          break;
        default:
          newCludoRecord[field.name] = convertContentType(atRecord.getCellValue(field.name),field.type)
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
function convertContentType(cellValue: any, ATfieldType: FieldType) : (string | number) {
  switch (ATfieldType) {
    case FieldType.BARCODE: //Object with shape {text: "xxx", ..}
      return cellValue.text

    case FieldType.BUTTON: //Object with shape {label: "xxx", url: "xxx", ...}
      return (cellValue.label +  " - " + cellValue.url)

    case FieldType.CHECKBOX: //Boolean
       return cellValue.toString()

    case FieldType.CREATED_BY: //These are all Objects Object with shape {email: "xxx", ...}
    case FieldType.LAST_MODIFIED_BY:
    case FieldType.SINGLE_COLLABORATOR:
         return cellValue.email

    case FieldType.EXTERNAL_SYNC_SOURCE: //These are all Objects with shape {name: "xxx", ...}
    case FieldType.SINGLE_SELECT:
    case FieldType.MULTIPLE_COLLABORATORS:
    case FieldType.MULTIPLE_ATTACHMENTS:
    case FieldType.MULTIPLE_LOOKUP_VALUES:
    case FieldType.MULTIPLE_RECORD_LINKS:
    case FieldType.MULTIPLE_SELECTS:
      return cellValue.name

    default: //Rest of cases are already in string or number format which is supported by Cludo's API
        return cellValue
  }
}

export {recordListConverter};