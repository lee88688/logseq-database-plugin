import React from 'react'
import { Input } from 'src/components/ui/input'
import { Badge } from 'src/components/ui/badge'

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
  onSelected?: (item: string) => void
  onRemoved?: (item: string) => void
} & UnionType

export function CellSelect(props: SelectProps) {
  const { options, value, onRemoved } = props

  const selected = Array.isArray(value) ? value : [value]

  return (
    <div>
      <div className={'flex flex-row flex-wrap items-center border-b'}>
        {selected.map((item) => (
          <Badge
            key={item}
            className={'text-sm font-medium py-1 m-1'}
            variant={'secondary'}
            onClose={() => onRemoved?.(item)}
          >
            {item}
          </Badge>
        ))}
        <Input className={'w-auto'} style={{ boxShadow: 'none' }} />
      </div>
      <ul>
        {options.map((item) => (
          <li key={item} className={'py-1 px-2'}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
