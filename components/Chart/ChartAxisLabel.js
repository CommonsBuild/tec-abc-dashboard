import React from 'react'
import classnames from 'classnames'
import { Tooltip } from '../_global'
import useHover from './useHover'

function ChartAxisLabel({ label, rotate, tooltipPosition, tooltipText }) {
  const [hoverRef, isHovered] = useHover()

  return (
    <Tooltip
      text={tooltipText}
      isHovered={isHovered}
      position={tooltipPosition}
    >
      <span
        ref={hoverRef}
        className={classnames(
          'font-bj font-bold text-xxs text-neon-light uppercase',
          rotate &&
            'block transform -rotate-90 w-56 text-center pt-2 tablet:pt-10 laptop:pt-18 desktop:pt-28'
        )}
        style={{ color: '#60D0DA' }}
      >
        {label}
      </span>
    </Tooltip>
  )
}

export default ChartAxisLabel
