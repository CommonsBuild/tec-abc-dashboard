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
import { ChartGrid } from '../Chart'

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

function BondingCurve({ chartData }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (chartData) {
      const { price, balanceInThousands } = chartData
      setData({
        labels: balanceInThousands,
        datasets: [
          {
            label: 'Price',
            fill: true,
            data: price,
            borderColor: 'transparent',
            pointBackgroundColor: '#DEFB48',
            pointHoverRadius: 7,
            pointRadius: 5,
            pointStyle: 'rect',
            backgroundColor: 'transparent',
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
        enabled: false,
      },
    },
    scales: {
      xAxes: {
        type: 'linear',
        grid: {
          display: false,
          borderColor: '#03B3FF',
        },
        ticks: {
          color: '#FFFFFF',
          callback(value) {
            return `${value}K`
          },
        },
      },
      yAxes: {
        type: 'linear',
        grid: {
          display: false,
          borderColor: '#03B3FF',
        },
        ticks: {
          color: '#FFFFFF',
          stepSize: 0.2,
          callback(value) {
            return value.toFixed(2)
          },
        },
        beginAtZero: true,
        position: 'left',
      },
    },
  }

  const leftContent = () => {
    return (
      <div>
        <MainTitle value="Bonding Curve" />
        <div
          css={`
            margin: 43.5px 0 0 0;
          `}
        >
          <Display title="Token Price" content={'1.60 wxDAI'} />
          <Display title="Reserve Balance" content={'743.340 wxDAI'} />
          <Display title="Reserve Ratio" content={'19.98%'} />
        </div>
      </div>
    )
  }

  const rightContent = () => {
    if (!data) return
    return (
      <div
        css={`
          width: 70%;
        `}
      >
        <ChartGrid
          id="Bonding Curve"
          chart={<Line data={data} options={options} />}
          // xAxisLabel={<ChartAxisLabel label="reserve balance (wxDAI)" />}
          // yAxisLabel={<ChartAxisLabel label="token price (wxdai)" rotate />}
        />
      </div>
    )
  }

  return (
    <SplitContainer leftContent={leftContent()} rightContent={rightContent()} />
  )
}

export default BondingCurve
