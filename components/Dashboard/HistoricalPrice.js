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
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { SplitContainer, MainTitle, Display } from './Helpers'
import { ChartGrid, ChartAxisLabel } from '../Chart'
import { bonded } from '../../config'
import { useConvertInputs } from './useConvertInputs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Filler,
  Legend
)

function HistoricalPrice({ chartData }) {
  const [data, setData] = useState(null)
  const {
    entryTributePct,
    exitTributePct,
    pricePerUnitReceived,
  } = useConvertInputs(bonded.symbol) // WXDAI
  const mintPrice = pricePerUnitReceived
    ? (1 / pricePerUnitReceived).toFixed(2)
    : 0
  const burnPrice = pricePerUnitReceived
    ? ((1 / pricePerUnitReceived) * (1 - exitTributePct / 100)).toFixed(2)
    : 0

  useEffect(() => {
    if (chartData) {
      const { price, balanceInThousands } = chartData
      setData({
        labels: balanceInThousands,
        datasets: [
          {
            label: 'Price',
            fill: 'start',
            data: price,
            borderColor: '#03B3FF',
            pointBackgroundColor: '#03B3FF',
            pointHoverRadius: 2,
            pointRadius: 1,
            pointStyle: 'rect',
          },
          {
            label: 'Price',
            fill: 'start',
            data: price.map(i => i / 2),
            borderColor: '#F56969',
            pointBackgroundColor: '#F56969',
            pointHoverRadius: 2,
            pointRadius: 1,
            pointStyle: 'rect',
          },
        ],
      })
    }
  }, [chartData])

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
        type: 'linear',
        grid: {
          borderColor: 'white',
        },
        ticks: {
          color: '#FFFFFF',
          callback(value) {
            return `${value}K`
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
    if (!data) return
    return (
      <div className="bg-transparent ml-6 mr-8 p-8 w-full">
        <ChartGrid
          id="Bonding Curve"
          chart={<Line data={data} options={options} />}
          xAxisLabel={<ChartAxisLabel label="time (days)" />}
          yAxisLabel={<ChartAxisLabel label="price of 1 tec (USD" rotate />}
        />
      </div>
    )
  }

  return (
    <SplitContainer leftContent={leftContent()} rightContent={rightContent()} />
  )
}

export default HistoricalPrice
