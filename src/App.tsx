import React from 'react'
import { ReactTabulator } from './reactTabulator/reactTabulator'
import { Column } from './reactTabulator/reactTabulator'
import { numberEditor, textEditor } from './reactTabulator/editor'
import { columnHeader } from './reactTabulator/column'
import { Button } from 'src/components/ui/button'
import { List, ListItem } from 'src/components/ui/list'
import { Separator } from 'src/components/ui/separator'

const tabledata = [
  { id: 1, name: 'Oli Bob', age: '12', col: 'red', dob: '' },
  { id: 2, name: 'Mary May', age: '1', col: 'blue', dob: '14/05/1982' },
  {
    id: 3,
    name: 'Christine Lobowski',
    age: '42',
    col: 'green',
    dob: '22/05/1982'
  },
  {
    id: 4,
    name: 'Brendon Philips',
    age: '125',
    col: 'orange',
    dob: '01/08/1980'
  },
  {
    id: 5,
    name: 'Margret Marmajuke',
    age: '16',
    col: 'yellow',
    dob: '31/01/1999'
  }
]

const cols: Array<Column> = [
  {
    id: '1',
    title: 'name',
    field: 'name',
    editable: true,
    titleFormatter: columnHeader,
    editor: textEditor
  },
  {
    id: '2',
    title: 'age',
    field: 'age',
    editable: true,
    editor: numberEditor
  }
]

function App() {
  return (
    <main>
      <List className={'w-40'}>
        <ListItem>test1</ListItem>
        <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>
        <ListItem>test2</ListItem>
        <ListItem>test2</ListItem>
      </List>
      <div>
        <Button variant={'outline'}>add</Button>
      </div>
      <ReactTabulator data={tabledata} cols={cols} onDataChange={(data, meta) => console.log(data, meta)} />
    </main>
  )
}

export default App
