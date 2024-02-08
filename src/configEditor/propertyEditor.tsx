import React from 'react'
import { Input } from 'src/components/ui/input'
import { Separator } from 'src/components/ui/separator'
import { List, ListItemButton, ListSeparator } from 'src/components/ui/list'

export function PropertyEditor() {
  return (
    <List>
      <Input className={'h-6'} />
      {/* editor type specific properties */}
      {/*<ListSeparator />*/}
      {/* editor additional properties */}
      <ListSeparator />
      {/*  common properties */}
      <ListItemButton>Delete Property</ListItemButton>
    </List>
  )
}
