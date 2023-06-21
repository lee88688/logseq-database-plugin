import {
  COLUMN_PREFIX,
  ColumnConfig,
  decodeColumnName,
  encodeColumnName,
  PageAlreadyExistsError,
  PageCreateError,
  propertyColumnKey,
  propertyKey
} from './index'

export class Database {
  pageName: string
  propertyBlockId = ''
  columns: Record<string, ColumnConfig> = {}
  hasMetaCache = false

  constructor(pageName = '') {
    this.pageName = pageName
  }

  getInitialPageProperties() {
    return {
      [propertyKey('version')]: 1
    }
  }

  async fetchDatabaseMeta(force = false) {
    if (this.hasMetaCache && !force) return

    if (!this.pageName) {
      throw new Error('page name is not set!')
    }

    const blocks = await logseq.Editor.getPageBlocksTree(this.pageName)
    const propertyBlock = blocks[0]
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

      this.hasMetaCache = true
      return
    }

    throw new Error('page does not have property block.')
  }

  async createDatabase(pageName: string) {
    const hasPageName = await logseq.Editor.getPage(pageName)
    if (hasPageName) {
      throw new PageAlreadyExistsError(`${pageName} already exists`)
    }

    const page = await logseq.Editor.createPage(pageName, this.getInitialPageProperties(), { redirect: false })
    if (!page) {
      throw new PageCreateError('page create failed')
    }

    return page
  }

  async createColumn(name: string, config: ColumnConfig) {
    await this.fetchDatabaseMeta()

    const encodeName = encodeColumnName(name)

    await logseq.Editor.upsertBlockProperty(this.propertyBlockId, propertyColumnKey(encodeName), JSON.stringify(config))
  }

  async removeColumn(name: string) {
    throw new Error('not implemented!')
  }

  async renameColumn(name: string) {
    throw new Error('not implemented!')
  }

  async updateColumn(name: string, config: ColumnConfig) {
    throw new Error('not implemented!')
  }

  async createRow<T>(row: T): Promise<string> {
    throw new Error('not implemented!')
  }

  async removeRow(id: string): Promise<boolean> {
    throw new Error('not implemented!')
  }

  async updateRow(id: string, row: any): Promise<boolean> {
    throw new Error('not implemented!')
  }

  async moveRow(id: string, to: string): Promise<boolean> {
    throw new Error('not implemented!')
  }
}
