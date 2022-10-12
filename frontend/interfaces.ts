import { Field } from "@airtable/blocks/models"

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

export interface FieldWithAlias extends Field {
    alias?: string
}