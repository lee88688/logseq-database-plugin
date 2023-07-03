export function encodeColumnName(name: string) {
  return name.replaceAll(' ', '+')
}

export function decodeColumnName(name: string) {
  return name.replaceAll('+', ' ')
}

export class PageAlreadyExistsError extends Error {}

export class PageCreateError extends Error {}

enum ColumnType {
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
  Select = 'select',
  MultiSelect = 'multiSelect',
  Tag = 'tag'
}

export type ColumnConfig =
  | {
      type: ColumnType.Boolean | ColumnType.Number | ColumnType.String
    }
  | {
      type: ColumnType.Select | ColumnType.MultiSelect | ColumnType.Tag
      enums: string[]
    }

const PROPERTY_PREFIX = 'database.'
export const COLUMN_PREFIX = `${PROPERTY_PREFIX}.column.`
export const propertyKey = (...keys: string[]) => `${PROPERTY_PREFIX}${keys.join('.')}`
export const propertyColumnKey = (name: string) => propertyKey('column', name)

export const DATABASE_VERSION_KEY = propertyKey('version')
