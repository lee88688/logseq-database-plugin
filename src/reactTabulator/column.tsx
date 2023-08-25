import React, { cloneElement, useCallback, useState } from 'react'
import * as tabulator from 'tabulator-tables'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from 'src/components/ui/dropdown-menu'
import { Input } from 'src/components/ui/input'
import { Editor } from './editor'
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'

type DropdownMenuSwitchItemProps = {
  id: string;
  renderContent?: boolean;
  menu: React.ReactNode;
  children: React.ReactNode;
  onSelect?: (id: string) => void;
}

function DropdownMenuSwitchItem(props: DropdownMenuSwitchItemProps) {
  if (props.renderContent) {
    return props.children;
  }

  return <DropdownMenuItem onSelect={(e) => {
    e.preventDefault()
    props.onSelect?.(props.id)
  }}>{props.menu}</DropdownMenuItem>;
}

type DropdownMenuSwitchItemElement = React.ReactComponentElement<typeof DropdownMenuSwitchItem, DropdownMenuSwitchItemProps>

type DropdownMenuSwitchGroupProps = {
  children?: DropdownMenuSwitchItemElement | Array<DropdownMenuSwitchItemElement>
}

function DropdownMenuSwitchGroup(props: DropdownMenuSwitchGroupProps) {
  const [selected, setSelected] = useState<string>('')

  const handleSelect = useCallback((id: string) => {
    setSelected(id)
  }, [])

  let children: Array<DropdownMenuSwitchItemElement> = props.children 
    ? Array.isArray(props.children) 
      ? props.children
      : [props.children]
    : [];

  const selectChild = children.find(child => child.props.id === selected)
  if (selectChild) {
    children = [cloneElement(selectChild, { renderContent: true }) as DropdownMenuSwitchItemElement]
  } else {
    children = children.map(child => cloneElement(child, { onSelect: handleSelect }) as DropdownMenuSwitchItemElement)
  }

  return <DropdownMenuGroup>{children}</DropdownMenuGroup>
}

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
          <DropdownMenuSwitchGroup>
            <DropdownMenuSwitchItem id='test' menu={'test'}>
              <Editor value={cell.getValue()}>{(val, onChange) => <Input value={val} onChange={e => onChange(e.target.value)}/>}</Editor>
            </DropdownMenuSwitchItem>
            <DropdownMenuSwitchItem id='23' menu='new'>xxx</DropdownMenuSwitchItem>
          </DropdownMenuSwitchGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return column.createPortal(tpl)
}
