import React, {
  createContext,
  Fragment,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { createPortal } from 'react-dom'
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
}

export function ReactTabulator<D>(props: ReactTabulatorProps<D>) {
  const rootElRef = useRef<HTMLDivElement>(null)
  const tabulatorRef = useRef<Tabulator>()

  const [isTableCreated, setIsTableCreated] = useState(false)
  const colsRef = useRef<Array<Column>>([])

  // const portalManagerRef = useRef<PortalManager>();
  const [portals, setPortals] = useState<Array<ReactPortal>>([])

  const pushTask = useTaskQueue<{ type: ColumnOptType; col: Column }>(({ type, col }) => {
    if (col.template) {
      col.formatter = (cell: CellComponent) => {
        console.log('cell format', cell.getData())
        return cell.createPortal((cell: CellComponent, el: HTMLElement, key: string) => {
          el.style.height = '100%'
          return createPortal(col.template?.(cell), el, key)
        })
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

  useEffect(() => {
    if (rootElRef.current) {
      tabulatorRef.current = new Tabulator(rootElRef.current, {
        movableRows: true,
        movableColumns: true,
        onPortalCacheChange: setPortals,
        data: props.data
      })
      tabulatorRef.current.on('tableBuilt', () => setIsTableCreated(true))
      window.tabulatorRef = tabulatorRef
    }
  }, [])

  useEffect(() => {
    if (isTableCreated) {
      for (const c of props.cols) {
        pushTask({ type: ColumnOptType.Add, col: c })
      }
    }
  }, [isTableCreated, props.cols, pushTask])

  return (
    <div>
      <div ref={rootElRef}></div>
      <Fragment key="portals">{isTableCreated && portals}</Fragment>
    </div>
  )
}
