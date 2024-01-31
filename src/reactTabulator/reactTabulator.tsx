import React, { Fragment, ReactNode, ReactPortal, useCallback, useEffect, useRef, useState } from 'react'
import {
  CellComponent,
  ColumnDefinition as ColDef,
  Tabulator,
  FormatModule,
  MoveRowsModule,
  MoveColumnsModule,
  ResizeColumnsModule,
  EditModule
} from 'tabulator-tables'
// import 'tabulator-tables/dist/css/tabulator.min.css'
import 'tabulator-tables/dist/css/tabulator_semanticui.min.css'
import { ReactTabulatorModule } from './reactTabulatorModule'

Tabulator.registerModule(ReactTabulatorModule)
Tabulator.registerModule(FormatModule)
Tabulator.registerModule(MoveRowsModule)
Tabulator.registerModule(MoveColumnsModule)
Tabulator.registerModule(ResizeColumnsModule)
Tabulator.registerModule(EditModule)

export type Template<T> = (component: T) => ReactNode

export type Column = ColDef & {
  id: string
  template?: Template<CellComponent>
}

export type DataChangeMeta =
  | {
      type: 'cellChange'
      index: number
      field: string
      value: unknown
    }
  | {
      type: 'rowMove'
      srcIndex: number
      targetIndex: number
    }
  | {
      type: 'rowDelete'
      index: number
    }
  | {
      type: 'rowAdd'
      index: number
    }

function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value

  return ref
}

function useTaskQueue<P>(fn: (p: P) => Promise<void>) {
  const tasksRef = useRef<Array<P>>([])
  const fnRef = useLatest(fn)
  const isStartRef = useRef(false)

  const startTask = useCallback(() => {
    const p = tasksRef.current.shift()
    if (p === undefined) {
      isStartRef.current = false
      return
    }
    fnRef.current(p).finally(startTask)
  }, [fnRef])

  const pushTask = useCallback(
    (p: P) => {
      tasksRef.current.push(p)
      if (!isStartRef.current) {
        isStartRef.current = true
        startTask()
      }
    },
    [startTask]
  )

  return pushTask
}

enum ColumnOptType {
  Add = 'add',
  Remove = 'remove'
}

type ReactTabulatorProps<D> = {
  data: Array<D>
  cols: Array<Column>
  children?: ReactNode

  onCellChange?: (rowIndex: number, field: string, value: any, cell: CellComponent) => void
  onDataChange?: (data: Array<D>, meta: DataChangeMeta) => void
}

export function ReactTabulator<D>(props: ReactTabulatorProps<D>) {
  const rootElRef = useRef<HTMLDivElement>(null)
  const tabulatorRef = useRef<Tabulator>()
  const dataRef = useRef(props.data)

  const [isTableCreated, setIsTableCreated] = useState(false)
  const colsRef = useRef<Array<Column>>([])

  // const portalManagerRef = useRef<PortalManager>();
  const [portals, setPortals] = useState<Array<ReactPortal>>([])

  const pushTask = useTaskQueue<{ type: ColumnOptType; col: Column }>(({ type, col }) => {
    if (col.template) {
      col.formatter = (cell: CellComponent) => {
        console.log('cell format', cell.getData())
        const el = cell.createPortal((cell: CellComponent) => {
          return col.template?.(cell)
        })
        el.style.height = '100%'
        return el
      }
    }
    if (type === ColumnOptType.Add) {
      return new Promise((resolve, reject) => {
        const cols = colsRef.current
        if (cols.some((item) => item.id === col.id)) {
          const columnComponents = tabulatorRef.current?.getColumns() ?? []
          const columnComponent = columnComponents.find((item) => {
            const def = item.getDefinition() as Column
            return def.id === col.id
          })
          if (!columnComponent) {
            console.warn('column component is not found')
            return cols
          }
          columnComponent
            .updateDefinition(col)
            .then(() => resolve())
            .catch(reject)
          colsRef.current = cols.map((item) => (item.id === col.id ? col : item))
        } else {
          tabulatorRef.current?.addColumn(col).then(resolve).catch(reject)
          colsRef.current = cols.concat(col)
        }
      })
    }

    return Promise.resolve()
  })

  const onDataChangeRef = useLatest(props.onDataChange)

  const handleCellChange = useCallback(
    (cell: CellComponent) => {
      const rowIndex = cell.getRow().getIndex()
      const columnKey = cell.getColumn().getField()
      const val = cell.getValue()
      console.log('cell change', rowIndex, columnKey)
      onDataChangeRef.current?.(dataRef.current, {
        type: 'cellChange',
        index: rowIndex,
        field: columnKey,
        value: val
      })
    },
    [onDataChangeRef]
  )

  useEffect(() => {
    if (rootElRef.current) {
      tabulatorRef.current = new Tabulator(rootElRef.current, {
        movableRows: false,
        movableColumns: true,
        onPortalCacheChange: setPortals,
        data: props.data
      })
      tabulatorRef.current.on('tableBuilt', () => setIsTableCreated(true))
      tabulatorRef.current.on('cellEdited', handleCellChange)
      window.tabulatorRef = tabulatorRef
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isTableCreated) {
      for (const c of props.cols) {
        pushTask({ type: ColumnOptType.Add, col: c })
      }
    }
  }, [isTableCreated, props.cols, pushTask])

  useEffect(() => {
    if (props.data !== dataRef.current) {
      dataRef.current = props.data
      tabulatorRef.current?.setData(props.data)
    }
  }, [props.data])

  return (
    <div>
      <div ref={rootElRef}></div>
      <Fragment key="portals">{isTableCreated && portals}</Fragment>
    </div>
  )
}
