import React from 'react'
import { BeatLoader } from 'react-spinners'

export default function Loading() {
  return (
 <div className="flex justify-center items-center py-5">
  <div className="sm:hidden">
    <BeatLoader size={6} />
  </div>

  <div className="hidden sm:block lg:hidden">
    <BeatLoader size={9} />
  </div>

  <div className="hidden lg:block">
    <BeatLoader size={20} />
  </div>
</div>
  )
}  