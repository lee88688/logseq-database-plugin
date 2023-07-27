import React from 'react'
import * as tabulator from 'tabulator-tables'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from 'src/components/ui/dropdown-menu'
import { Input } from 'src/components/ui/input'
import { Editor } from './editor'

export const columnHeader: tabulator.Formatter = (cell: tabulator.CellComponent) => {
  console.log(cell)
  const column = cell.getColumn()
  
  const tpl = (t: unknown) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>{cell.getValue()}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <Editor value={cell.getValue()}>{(val, onChange) => <Input value={val} onChange={e => onChange(e.target.value)}/>}</Editor>
          <DropdownMenuSeparator/>
          <DropdownMenuItem>test</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return column.createPortal(tpl)
}
