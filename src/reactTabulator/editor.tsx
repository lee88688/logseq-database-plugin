import React, { useCallback, useEffect, useRef, useState } from 'react'
import isEqual from 'lodash/isEqual'
import { Input } from 'src/components/ui/input'
import * as tabulator from 'tabulator-tables'
import { CellPopover } from 'src/components/ui/cell-popover'
import { EDITOR_PORTAL_KEY } from 'src/reactTabulator/reactTabulatorModule'
import { CellSelect } from 'src/components/ui/cell-select'

export type EditorProps<T> = {
  value: T
  onChange?: (val: T) => void
  onSuccess?: (val: T) => void
  onCancel?: (val: T) => void
  children: (value: T, onChange: (val: T) => void, success: (val: T) => void, cancel: () => void) => React.ReactElement
}

export function Editor<T>(props: EditorProps<T>) {
  const { onSuccess, onCancel } = props

  const [value, setValue] = useState(props.value)
  const initialValurRef = useRef(props.value)

  const success = useCallback(
    (val: T) => {
      setTimeout(() => onSuccess?.(val))
    },
    [onSuccess]
  )

  const cancel = useCallback(() => {
    setTimeout(() => onCancel?.(initialValurRef.current))
  }, [onCancel])

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return props.children(value, setValue, success, cancel)
}

export const textEditor: tabulator.Editor = (cell, onRendered, success, cancel, editorParams) => {
  const table = cell.getTable()
  const tpl = (t: unknown) => {
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
        <CellPopover onHide={handleBlur}>
          <Input
            value={value}
            style={{ height: 'calc(var(--radix-popover-trigger-height) + 2px)' }}
            onChange={(e) => onChange(e.target.value)}
          />
        </CellPopover>
      )
    }
    return <Editor value={initialValue}>{child}</Editor>
  }
  const el = table.createPortal(tpl, () => EDITOR_PORTAL_KEY)
  el.style.height = '100%'
  el.style.position = 'relative'
  return el
}

export const selectEditor: tabulator.Editor = (cell, onRendered, success, cancel, editorParams) => {
  const table = cell.getTable()
  const tpl = (t: unknown) => {
    // const initialValue = cell.getValue()
    const initialValue: string[] = Array.isArray(cell.getValue()) ? cell.getValue() : []
    let options = ['test', 'test2', 'test4', 'test5']
    const child: EditorProps<string[]>['children'] = (value, onChange) => {
      const handleBlur = () => {
        if (isEqual(initialValue, value)) {
          cancel(initialValue)
        } else {
          success(value)
        }
      }

      return (
        <CellPopover onHide={handleBlur}>
          <CellSelect
            options={options}
            type={'multiple'}
            value={value}
            onSelect={(val) => onChange(value.concat(val))}
            onRemove={(val) => onChange(value.filter((item) => item !== val))}
            onCreate={(val) => {
              options = options.concat(val)
              onChange(value.concat(val))
            }}
          />
        </CellPopover>
      )
    }
    return <Editor value={initialValue}>{child}</Editor>
  }
  const el = table.createPortal(tpl, () => EDITOR_PORTAL_KEY)
  el.style.height = '100%'
  el.style.position = 'relative'
  return el
}
