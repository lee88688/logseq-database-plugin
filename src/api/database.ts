import { ColumnConfig, PageAlreadyExistsError, PageCreateError } from './index'
import { createMetaDataFactory, MetaDataBase } from './metaData'

export class Database {
  pageName: string
  propertyBlockId = ''
  columns: Record<string, ColumnConfig> = {}
  hasMetaCache = false

  metaData?: MetaDataBase

  constructor(pageName = '') {
    this.pageName = pageName
  }

  async createDatabase(pageName: string) {
    const hasPageName = await logseq.Editor.getPage(pageName)
    if (hasPageName) {
      throw new PageAlreadyExistsError(`${pageName} already exists`)
    }

    this.metaData = await createMetaDataFactory(pageName, true)

    const page = await logseq.Editor.createPage(pageName, this.metaData.getInitialPageProperties(), { redirect: false })
    if (!page) {
      throw new PageCreateError('page create failed')
    }

    return page
  }

  async fetchDatabase() {
    if (!this.pageName) throw new Error('page name is not found')

    this.metaData = await createMetaDataFactory(this.pageName)
  }

  async createColumn(name: string, config: ColumnConfig) {
    await this.metaData?.createColumn(name, config)
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
