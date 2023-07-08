import { Database } from 'src/api/database'

export class BlockDatabase extends Database {
  async removeColumn(name: string) {
    await this.metaData?.removeColumn(name)
    for (const block of this.metaData?.dataBlocks ?? []) {
      await logseq.Editor.removeBlockProperty(block.uuid, name)
    }
  }

  async renameColumn(name: string) {}
}
