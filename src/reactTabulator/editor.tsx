import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Input } from 'src/components/ui/input'
import * as tabulator from 'tabulator-tables'
import { CellPopover } from 'src/components/ui/cell-popover'
import { EDITOR_PORTAL_KEY } from 'src/reactTabulator/reactTabulatorModule'
import { CellSelect } from 'src/components/ui/cell-select'

export type EditorProps<T> = {
  value: T
  onChange?: (val: T) => void
  children: (value: T, onChange: (val: T) => void) => React.ReactElement
}

export function Editor<T>(props: EditorProps<T>) {
  const [value, setValue] = useState(props.value)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return props.children(value, setValue)
}

export const textEditor: tabulator.Editor = (cell, onRendered, success, cancel, editorParams) => {
  const table = cell.getTable()
  const tpl = (t: any, el: HTMLElement, key: string) => {
    const initialValue = cell.getValue()
    const child: EditorProps<string>['children'] = (value, onChange) => {
      const handleBlur = () => {
        if (initialValue === value) {
          cancel(initialValue)
        } else {
          success(value)
        }
      }

      return (
        <Input
          value={value}
          style={{ height: '100%' }}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
        />
      )
    }
    return createPortal(<Editor value={initialValue}>{child}</Editor>, el, key)
  }
  const el = table.createPortal(tpl, () => 'editor')
  el.style.height = '100%'
  el.style.position = 'relative'
  return el
}

export const selectEditor: tabulator.Editor = (cell, onRendered, success, cancel, editorParams) => {
  const table = cell.getTable()
  const tpl = (t: any, el: HTMLElement, key: string) => {
    const initialValue = cell.getValue()
    const child: EditorProps<string>['children'] = (value, onChange) => {
      const handleBlur = () => {
        if (initialValue === value) {
          cancel(initialValue)
        } else {
          success(value)
        }
      }

      return (
        <CellPopover onHide={() => setTimeout(() => cancel(value))}>
          <CellSelect
            options={['test', 'test2', 'test4', 'test5']}
            type={'multiple'}
            value={['test', 'test2', 'test4', 'test3', 'test33', 'test233']}
          />
        </CellPopover>
      )
    }
    return createPortal(<Editor value={initialValue}>{child}</Editor>, el, key)
  }
  const el = table.createPortal(tpl, () => EDITOR_PORTAL_KEY)
  el.style.height = '100%'
  el.style.position = 'relative'
  return el
}
