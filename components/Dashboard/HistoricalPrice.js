import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-moment'
import { Line } from 'react-chartjs-2'
import { useWalletAugmented } from 'lib/wallet'
import Image from 'next/image'
import { SplitContainer, MainTitle, Display } from './Helpers'
import { ChartGrid, ChartAxisLabel } from '../Chart'
import { bonded } from '../../config'
import { useConvertInputs } from './useConvertInputs'
import { useBondingCurvePrice } from 'lib/web3-contracts'
import { formatUnits, parseUnits } from 'lib/web3-utils'

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Filler,
  Legend
)

function HistoricalPrice({ mintBurnPrices, chartData }) {
  const [data, setData] = useState(null)
  const { account } = useWalletAugmented()

  const {
    amountSource,
    entryTributePct,
    exitTributePct,
    pricePerUnitReceived,
  } = useConvertInputs(bonded.symbol) // WXDAI
  const mintPrice = pricePerUnitReceived
    ? (1 / pricePerUnitReceived).toFixed(2)
    : 0

  const { pricePerUnit: burnPricePerUnit } = useBondingCurvePrice(
    amountSource,
    false
  )
  const burnPrice =
    !!burnPricePerUnit && burnPricePerUnit >= 0
      ? parseFloat(formatUnits(burnPricePerUnit)).toFixed(2)
      : 0

  useEffect(() => {
    if (mintBurnPrices) {
      const { burn, mint } = mintBurnPrices
      setData({
        datasets: [
          {
            label: 'Price',
            fill: 'start',
            data: burn,
            borderColor: '#F56969',
            pointBackgroundColor: '#03B3FF',
            pointHoverRadius: 2,
            pointRadius: 1,
            pointStyle: 'rect',
          },
          {
            label: 'Price',
            fill: 'start',
            data: mint,
            borderColor: '#03B3FF',
            pointBackgroundColor: '#F56969',
            pointHoverRadius: 2,
            pointRadius: 1,
            pointStyle: 'rect',
          },
        ],
      })
    }
  }, [mintBurnPrices])

  const options = {
    responsive: true,
    aspectRatio: 2.75,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem, data) => {
            return `$${tooltipItem?.formattedValue} WXDAI`
          },
        },
      },
    },
    scales: {
      xAxes: {
        type: 'time',
        time: {
          unit: 'month',
        },
        grid: {
          borderColor: 'white',
        },
        ticks: {
          color: '#FFFFFF',
          callback(value) {
            return `${value}`
          },
        },
      },
      y: {
        type: 'linear',
        grid: {
          drawBorder: false,
          color: function() {
            return '#353535'
          },
        },
        ticks: {
          color: 'white',
        },
        beginAtZero: true,
        position: 'left',
      },
      yAxes: {
        display: false,
      },
    },
    tooltips: {
      mode: 'index',
      intersect: true,
    },
  }

  const leftContent = () => {
    return (
      <div>
        <MainTitle value="Historical Price" />
        <div
          css={`
            margin: 43.5px 0 0 0;
          `}
        >
          <Display title="Mint" content={`${mintPrice} USD`} />
          <Display title="Burn" content={`${burnPrice} USD`} />
        </div>
      </div>
    )
  }

  const rightContent = () => {
    if (!account || !data)
      return (
        <div className="bg-transparent ml-6 mr-8 mt-16 p-8 w-full">
          <Image
            src={'/images/placeholders/historical_price.png'}
            width="703px"
            height="258px"
            style={{
              filter: 'blur(0.4rem)',
              'pointer-events': 'none',
            }}
          />
        </div>
      )

    return (
      <div className="bg-transparent ml-6 mr-8 p-8 w-full">
        <ChartGrid
          id="Bonding Curve"
          chart={<Line data={data} options={options} />}
          xAxisLabel={<ChartAxisLabel label="time (month)" />}
          yAxisLabel={<ChartAxisLabel label="price of 1 tec (USD)" rotate />}
        />
      </div>
    )
  }

  return (
    <SplitContainer leftContent={leftContent()} rightContent={rightContent()} />
  )
}

export default HistoricalPrice
