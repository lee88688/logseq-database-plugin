import React from 'react'
import { ReactTabulator } from './reactTabulator/reactTabulator'
import { Column } from './reactTabulator/reactTabulator'
import { Editor, numberEditor, selectEditor, textEditor } from './reactTabulator/editor'
import { Badge } from 'src/components/ui/badge'
import { CellSelect } from 'src/components/ui/cell-select'
import { columnHeader } from './reactTabulator/column'

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
      <ReactTabulator data={tabledata} cols={cols} onDataChange={(data, meta) => console.log(data, meta)} />
    </main>
  )
}

export default App
