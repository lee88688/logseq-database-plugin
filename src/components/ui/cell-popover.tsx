import React, { useCallback, useEffect, useRef } from 'react'
import * as Popover from '@radix-ui/react-popover'

export type CellPopoverProps = React.PropsWithChildren<{
  onHide?: () => void
}>

export function CellPopover(props: CellPopoverProps) {
  const { onHide } = props

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onHide?.()
    },
    [onHide]
  )

  return (
    <Popover.Root defaultOpen onOpenChange={handleOpenChange} modal>
      <Popover.Anchor asChild>
        <div className={'min-w-full min-h-full'} />
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content align={'start'} sideOffset={-1} alignOffset={-1} className={'cell-popover'}>
          {props.children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
