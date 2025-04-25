import React from 'react'
   {/* Responsive cosmic grid */}
const Cosmicgrid = () => {
  return (
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_60%,black)]">
        <div className="h-[200%] w-[200%] [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] [transform:rotate(15deg)] translate-x-[-25%]" />
      </div>
  )
}

export default Cosmicgrid