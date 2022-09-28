import React from 'react'
import PropTypes from 'prop-types'
import successIcon from './assets/success.svg'
import waitingIcon from './assets/waiting.svg'
import workingIcon from '../../assets/token.svg'
import errorIcon from './assets/error.svg'
import errorPip from './assets/error-pip.svg'
import successPip from './assets/success-pip.svg'
import {
  STEP_WAITING,
  STEP_WORKING,
  STEP_SUCCESS,
  STEP_ERROR,
} from './stepper-statuses'
import Image from 'next/image'

const STATUS_ICONS = {
  [STEP_WAITING]: waitingIcon,
  [STEP_WORKING]: workingIcon,
  [STEP_SUCCESS]: successIcon,
  [STEP_ERROR]: errorIcon,
}

const PIP_ICONS = {
  [STEP_ERROR]: errorPip,
  [STEP_SUCCESS]: successPip,
}

function renderPipIfErrorOrSuccess(status) {
  let pipImage = PIP_ICONS[status]

  return (
    <>
      {pipImage && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        >
          <Image src={pipImage} alt="" width="24px" height="24px" />
        </div>
      )}
    </>
  )
}

function StatusIcon({ status }) {
  const icon = STATUS_ICONS[status]

  return (
    <div
      css={`
        position: relative;
      `}
    >
      {renderPipIfErrorOrSuccess(status)}
      <Image src={icon} alt="" width="64px" height={'64px'} />
    </div>
  )
}

StatusIcon.propTypes = {
  title: PropTypes.string,
  status: PropTypes.oneOf([
    STEP_WAITING,
    STEP_WORKING,
    STEP_SUCCESS,
    STEP_ERROR,
  ]),
}

export default StatusIcon
