import React, { useRef } from 'react'
import { createPortal } from 'react-dom'
import { ReactTabulator } from './reactTabulator/reactTabulator'
import { Column } from './reactTabulator/reactTabulator'
import { Button, InputGroup, NumericInput } from '@blueprintjs/core'
import { Editor, selectEditor, textEditor } from './reactTabulator/editor'
import { Input } from 'src/components/ui/input'

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
      <div className={'m-1'}>
        <Button icon={'refresh'} outlined>
          clock
        </Button>
      </div>
      <ReactTabulator data={tabledata} cols={cols} />
    </main>
  )
}

export default App
