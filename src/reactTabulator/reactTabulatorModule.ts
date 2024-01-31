import { Module, Tabulator, CellComponent, ColumnComponent } from 'tabulator-tables'
import { ReactPortal, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import debounce from 'lodash/debounce'

declare module 'tabulator-tables' {
  interface Module {
    table: Tabulator

    registerTableOption(key: string, value: unknown): void

    registerColumnOption(key: string, value: unknown): void
    registerTableFunction(key: string, value: unknown): void
    registerComponentFunction(component: string, key: string, value: unknown): void
    subscribe(name: string, callback: (...args: unknown[]) => void): void
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Tabulator {
    // @ts-ignore
    export function registerModule1(module: any): void
  }

  interface CellComponent {
    createPortal(cb: RenderFn<CellComponent>): HTMLElement
  }

  interface ColumnComponent {
    createPortal(cb: RenderFn<ColumnComponent>): HTMLElement
  }
}

export const EDITOR_PORTAL_KEY = 'editor'

export type RenderFn<T> = (component: T) => ReactNode
type CacheItem = { el: HTMLElement; portal: ReactPortal }

export class ReactTabulatorModule extends Module {
  _portalCache = new Map<string, CacheItem>()

  cellKeyFn = (cell: CellComponent) => {
    return `cell-${cell.getRow().getIndex()}-${cell.getColumn().getDefinition().id}`
  }

  columnKeyFn = (column: ColumnComponent) => {
    return `column-${column.getDefinition().id}`
  }

  debouncedChange: (() => void) | undefined

  constructor(table: Tabulator) {
    super(table)

    // todo 通知变更需要debounce，可以考虑使用外部的debounce函数
    this.registerTableOption('onPortalCacheChange', () => {})

    this.registerColumnOption('id', null)

    this.registerTableFunction('createPortal', (fn: RenderFn<Tabulator>, keyFn: (c: Tabulator) => string) => {
      return this.createComponentPortal<Tabulator>(this.table, keyFn, fn, false)
    })

    this.registerComponentFunction(
      'cell',
      'createPortal',
      (cell: CellComponent, fn: RenderFn<CellComponent>, cellKeyFn: (c: CellComponent) => string = this.cellKeyFn) => {
        console.log('cell component')
        return this.createComponentPortal(cell, cellKeyFn, fn)
      }
    )

    this.registerComponentFunction(
      'column',
      'createPortal',
      (
        column: ColumnComponent,
        fn: RenderFn<ColumnComponent>,
        columnKeyFn: (c: ColumnComponent) => string = this.columnKeyFn
      ) => {
        console.log('column render')
        return this.createComponentPortal(column, columnKeyFn, fn)
      }
    )
  }

  initialize() {
    this.subscribe('cell-delete', this.componentDelete.bind(this))
    this.subscribe('column-delete', this.componentDelete.bind(this))
    // 取消编辑
    this.subscribe('edit-editor-clear', () => this.delete(EDITOR_PORTAL_KEY))
    // 行或者列移动之后需要重新渲染对应的行或者列

    this.debouncedChange = debounce(() => {
      const portals = this.getCachePortals()
      this.table.options.onPortalCacheChange(portals)
    })
  }

  get(key: string): CacheItem | undefined {
    return this._portalCache.get(key)
  }

  set(key: string, cache: CacheItem) {
    const res = this._portalCache.set(key, cache)
    res && this.debouncedChange?.()
    return res
  }

  delete(key: string) {
    const res = this._portalCache.delete(key)
    res && this.debouncedChange?.()
    return res
  }

  getCachePortals(): Array<ReactPortal> {
    const portals: ReactPortal[] = []

    for (const v of this._portalCache.values()) {
      portals.push(v.portal)
    }

    return portals
  }

  addComponentPortalKey<T>(component: T, key: string) {
    let { react } = (component as any).modules
    if (!react || !react.keys) {
      react = react ?? { keys: {} }
      react.keys = react.keys ?? {}
    }
    react.keys[key] = true
  }

  removeComponentPortalKey<T>(component: T, key: string) {
    const { react } = (component as any).modules
    if (!react || !react.keys) return
    delete react.keys[key]
  }

  getComponentPortalKey<T>(component: T) {
    const keys = (component as any).modules.react?.keys
    if (!keys) return []
    return Object.keys(keys)
  }

  createComponentPortal<T>(component: T, keyFn: (c: T) => string, fn: RenderFn<T>, addToComponent = true) {
    const proxyComponent = (component as any).getComponent?.() ?? component
    const key = keyFn(proxyComponent)
    let cache = this.get(key)
    if (!cache) {
      const div = document.createElement('div')
      const portal = createPortal(fn(proxyComponent), div, key)
      cache = {
        el: div,
        portal
      }
      if (addToComponent) this.addComponentPortalKey<T>(component, key)
    } else {
      cache.portal = createPortal(fn(proxyComponent), cache.el, key)
    }
    this.set(key, cache)

    return cache.el
  }

  componentDelete<T>(component: T) {
    const keys = this.getComponentPortalKey<T>(component)
    for (const k of keys) {
      this.delete(k)
    }
  }
}

ReactTabulatorModule.moduleName = 'ReactTabulatorModule'
