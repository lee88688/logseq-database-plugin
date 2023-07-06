import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Input } from 'src/components/ui/input'
import * as tabulator from 'tabulator-tables'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'

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

export function Select() {
  return (
    <Popover open onOpenChange={(...args) => console.log(args)}>
      <PopoverTrigger>
        <Input onClick={(e) => e.stopPropagation()} />
      </PopoverTrigger>
      <PopoverContent align={'start'}>
        <div>hello world</div>
      </PopoverContent>
    </Popover>
  )
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

      return <Select />
    }
    return createPortal(<Editor value={initialValue}>{child}</Editor>, el, key)
  }
  const el = table.createPortal(tpl, () => 'editor')
  el.style.height = '100%'
  el.style.position = 'relative'
  return el
}
