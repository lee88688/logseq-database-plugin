import React from 'react'
import { ReactTabulator } from './reactTabulator/reactTabulator'
import { Column } from './reactTabulator/reactTabulator'
import { Editor, selectEditor, textEditor } from './reactTabulator/editor'
import { Badge } from 'src/components/ui/badge'
import { CellSelect } from 'src/components/ui/cell-select'

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
    editor: textEditor
  },
  {
    id: '2',
    title: 'age',
    field: 'age',
    editable: true,
    editor: selectEditor
  }
]

function App() {
  return (
    <main>
      <ReactTabulator data={tabledata} cols={cols} />
    </main>
  )
}

export default App
