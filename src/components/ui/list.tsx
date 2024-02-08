import React from 'react'
import { cn } from 'src/lib/utils'

export function List(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <ul
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md bg-popover p-1 text-popover-foreground',
        props.className
      )}
    >
      {props.children}
    </ul>
  )
}

export function ListItem(props: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  return (
    <li
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </li>
  )
}

export function ListItemButton(props: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  return (
    <li
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </li>
  )
}

export function ListSeparator() {
  return <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>
}
