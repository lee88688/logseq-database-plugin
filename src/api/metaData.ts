import { COLUMN_PREFIX, ColumnConfig, decodeColumnName, DATABASE_VERSION_KEY, encodeColumnName, propertyColumnKey } from "./index";
import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

export abstract class MetaDataBase {
  abstract pageName: string
  columns: Record<string, ColumnConfig> = {}
  propertyBlockId = ''
  hasMetaCache = false
  dataBlocks: BlockEntity[] = []

  abstract fetchDatabaseMeta(force?: boolean): Promise<void>
  abstract getInitialPageProperties(): any

  abstract createColumn(name: string, config: ColumnConfig): Promise<void>
}

class MetaDataBaseV1 extends MetaDataBase {
  pageName: string;

  constructor(pageName: string) {
    super()
    this.pageName = pageName;    
  }

  getInitialPageProperties() {
    return {
      [DATABASE_VERSION_KEY]: 1,
    }
  }

  async fetchDatabaseMeta(force = false) {
    if (this.hasMetaCache && !force) return

    if (!this.pageName) {
      throw new Error('page name is not set!')
    }

    const blocks = await logseq.Editor.getPageBlocksTree(this.pageName)
    const [propertyBlock, ...dataBlocks] = blocks
    if (propertyBlock?.['preBlock?']) {
      this.propertyBlockId = propertyBlock.uuid

      const properties = propertyBlock.properties
      const columns: Record<string, ColumnConfig> = {}
      properties &&
        Object.keys(propertyBlock.properties ?? {})
          .filter((key) => key.startsWith(COLUMN_PREFIX))
          .forEach((key) => {
            const columnName = decodeColumnName(key.slice(COLUMN_PREFIX.length))
            const json = properties[columnName]
            columns[columnName] = JSON.parse(json)
          })
      this.columns = columns

      this.dataBlocks = dataBlocks

      this.hasMetaCache = true
      return
    }

    throw new Error('page does not have property block.')
  }

  async createColumn(name: string, config: ColumnConfig): Promise<void> {
    const encodeName = encodeColumnName(name)

    await logseq.Editor.upsertBlockProperty(this.propertyBlockId, propertyColumnKey(encodeName), JSON.stringify(config))
  }
}

export async function createMetaDataFactory(pageName: string, newPage = false) {
  if (newPage) {
    return new MetaDataBaseV1(pageName)
  }

  const page = await logseq.Editor.getPage(pageName)
  const version = page?.properties?.[DATABASE_VERSION_KEY]
  if (!version) throw new Error('database version can not be found in page!')

  switch (version) {
    case 1:
      return new MetaDataBaseV1(pageName)
    default:
      throw new Error(`unknown database version(${version}) is found in ${pageName}`)
  }
}