import { Field } from '@airtable/blocks/models';

export enum CludoFieldType {
    Number = 'number',
    Date = 'date',
    String = 'string',
    Null = 'null'
}

export interface CludoIndexElement {
    Title: string
    Description: string
    Url: string
    [x: string]: CludoFieldType | string | number | boolean
}

export interface CludoRecordField {
    fieldName: string
    type: CludoFieldType
    value: any
}

export interface ATRecord {
    id: string
    getCellValue: (fieldOrIdOrName: Field | string) => unknown;
}

export interface CludoRecord {
    id: string
    content: CludoRecordField[]
}

export interface CludoSyncBatch {
    id: number
    crawlerId: number
    customerId: number
    records: CludoRecord[]
}