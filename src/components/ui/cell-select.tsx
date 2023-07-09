import React, { useMemo, useState } from 'react'
import { Input } from 'src/components/ui/input'

type TagProps = React.PropsWithChildren<{
  onClose?: () => void
}>

function Tag(props: TagProps) {
  return (
    <div className={'inline-flex items-center px-2 py-1 m-1 text-sm font-medium rounded bg-neutral-200'}>
      {props.children}
      {props.onClose && (
        <div className={'ml-1 cursor-pointer'} onClick={props.onClose}>
          <svg width="12" height="12" viewBox="0 0 15 15">
            <path
              d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      )}
    </div>
  )
}

type UnionType =
  | {
      type: 'single'
      value: string
    }
  | {
      type: 'multiple'
      value: string[]
    }

type SelectProps = {
  options: string[]
  onSelect?: (item: string) => void
  onRemove?: (item: string) => void
  onCreate?: (item: string) => void
} & UnionType

export function CellSelect(props: SelectProps) {
  const { options, value, type } = props

  const [inputValue, setInputValue] = useState('')

  const selected = Array.isArray(value) ? value : [value]

  const filteredOptions = useMemo(() => {
    // todo: when item is in options, it should not create new.
    return options.filter((item) => item.includes(inputValue))
  }, [inputValue, options])

  return (
    <div>
      <div className={'flex flex-row flex-wrap items-center border-b'}>
        {selected.map((item) => (
          <Tag key={item} onClose={() => props.onRemove?.(item)}>
            {item}
          </Tag>
        ))}
        <Input
          className={'w-auto'}
          style={{ boxShadow: 'none' }}
          value={inputValue}
          onInput={(e) => setInputValue(e.target.value)}
        />
      </div>
      <ul className={'p-1'}>
        {filteredOptions.map((item) => (
          <li
            key={item}
            className={'py-1 px-2 cursor-default select-none items-center rounded-sm font-medium hover:bg-accent'}
            onClick={() => {
              if (type === 'multiple' && value.includes(item)) return
              props.onSelect?.(item)
            }}
          >
            {item}
          </li>
        ))}
        {inputValue && (
          <li
            className={'px-2 cursor-default select-none items-center rounded-sm font-medium hover:bg-accent'}
            onClick={() => {
              props.onCreate?.(inputValue)
              setInputValue('')
            }}
          >
            create new <Tag>{inputValue}</Tag>
          </li>
        )}
      </ul>
    </div>
  )
}
