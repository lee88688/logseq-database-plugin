import React from 'react'
import { Input } from 'src/components/ui/input'
import { Separator } from 'src/components/ui/separator'

function PropertyEditor() {
  return (
    <div>
      <Input />
      {/* editor type specific properties */}
      <Separator />
      {/* editor additional properties */}
      <Separator />
      {/*  common properties */}
    </div>
  )
}
