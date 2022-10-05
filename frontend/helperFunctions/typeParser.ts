// Interfaces
import { ATRecord, CludoFieldType, CludoRecord, ATField, CludoIndexElement } from '../interfaces';
import { FieldType } from '@airtable/blocks/models';

function recordListConverter(recordList: ATRecord[], visibleFields: ATField[]) : CludoIndexElement[] {
  return recordList.map((rec: ATRecord) : CludoIndexElement => {
    return singleRecordConverter(rec, visibleFields);
  });
}

function singleRecordConverter(atRecord: ATRecord, visibleFields: ATField[]) : CludoIndexElement {
  let newCludoRecord: CludoIndexElement = {
    Title: '' ,
    Description: '',
    Url: '',
    valid: false,
    id: atRecord.id
  };
  visibleFields.forEach((field: ATField) => {
    if (atRecord.getCellValue(field.name)){
      switch (field.name.toLowerCase()) {
        case "url":
          newCludoRecord["Url"] = convertContent(atRecord.getCellValue(field.name),field.type).toString()
          break;
        case "title":
          newCludoRecord["Title"] = convertContent(atRecord.getCellValue(field.name),field.type).toString()
          break;
        case "description":
          newCludoRecord["Description"] = convertContent(atRecord.getCellValue(field.name),field.type).toString()
          break;
        default:
          newCludoRecord[field.name] = convertContent(atRecord.getCellValue(field.name),field.type)
          break;
      }
    }
  })
  if (newCludoRecord.Title && newCludoRecord.Description && newCludoRecord.Url) {
    newCludoRecord["valid"] = true
  }
  return newCludoRecord;
}

function convertContent(cellValue: any, fieldType: FieldType) : (string | number) {
  switch (fieldType) {
    case FieldType.BARCODE:
      return cellValue.text

    case FieldType.BUTTON:
      return (cellValue.label +  " - " + cellValue.url)

    case FieldType.CHECKBOX:
       return cellValue.toString()

    case FieldType.CREATED_BY:
    case FieldType.LAST_MODIFIED_BY:
    case FieldType.SINGLE_COLLABORATOR:
         return cellValue.email

    case FieldType.EXTERNAL_SYNC_SOURCE:
    case FieldType.SINGLE_SELECT:
    case FieldType.MULTIPLE_COLLABORATORS:
    case FieldType.MULTIPLE_ATTACHMENTS:
    case FieldType.MULTIPLE_LOOKUP_VALUES:
    case FieldType.MULTIPLE_RECORD_LINKS:
    case FieldType.MULTIPLE_SELECTS:
      return cellValue.name
    default:
        return cellValue
  }
}

export {recordListConverter};