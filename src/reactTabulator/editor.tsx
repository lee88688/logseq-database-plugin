import React, { useEffect, useState } from 'react'

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
