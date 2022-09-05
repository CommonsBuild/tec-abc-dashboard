import React from 'react'
import Image from 'next/image'

function ChartGrid({ chart, id, xAxisLabel, yAxisLabel }) {
  return (
    <div className="bg-black-300 w-full h-full" id={id}>
      <div className="grid chart-grid pt-20">
        <div className="flex m-0 w-max">{yAxisLabel}</div>
        <div className="flex justify-center py-2">
          <div className="relative h-3/5 ">
            <Image layout="fill" src="/chart_bg.png" />
          </div>
          <div className="relative w-full">{chart}</div>
        </div>
        <div />
        <div className="justify-self-center">{xAxisLabel}</div>
      </div>
    </div>
  )
}

export default ChartGrid
