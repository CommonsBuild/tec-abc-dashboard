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
import { useWalletAugmented } from 'lib/wallet'
import { Line } from 'react-chartjs-2'
import { SplitContainer, MainTitle, Display } from './Helpers'
import { ChartGrid, ChartAxisLabel } from '../Chart'
import { useBondingCurvePrice, useCollateral } from 'lib/web3-contracts'
import { bonded } from '../../config'
import { useConvertInputs } from './useConvertInputs'
import { formatLocale } from 'utils'
import Image from 'next/image'

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
  const [priceIndex, setPriceIndex] = useState(null)
  const { pricePerUnitReceived } = useConvertInputs(bonded.symbol) // WXDAI
  const { reservePoolValue } = useBondingCurvePrice()
  const { account } = useWalletAugmented()
  const [virtualBalance, virtualSupply, reserveRatio] = useCollateral()

  const collateralReserveRatio = reserveRatio / 1e4
  const mintPrice = pricePerUnitReceived
    ? (1 / pricePerUnitReceived).toFixed(2)
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
            backgroundColor: ({ chart }) => {
              const { ctx, chartArea } = chart
              if (!chartArea) return 'red'
              // TODO: ADD THE RIGHT ANGLE
              const angleInDeg = 321.68
              const angle = ((180 - angleInDeg) / 180) * Math.PI
              const x2 = 200 * Math.cos(angle)
              const y2 = 100 * Math.sin(angle)
              const bg = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              )
              bg.addColorStop(0.1, 'rgba(3, 179, 255, 0.4')
              bg.addColorStop(0.9, 'rgba(222, 251, 72, 0.03)')
              return bg
            },
          },
        ],
      })
    }
  }, [chartData])

  useEffect(() => {
    const getPricePoint = () => {
      if (!mintPrice || !chartData) return
      const index = chartData?.price?.findIndex(i => {
        return parseFloat(i).toFixed(2) == parseFloat(mintPrice).toFixed(2)
      })
      setPriceIndex(index)
    }
    getPricePoint()
  }, [mintPrice, chartData])

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

  const plugins = [
    {
      afterDraw: chart => {
        const { ctx, scales, _metasets } = chart
        // paint static vertical line
        const parsedDataset = _metasets[0]?._parsed
        // replace these values with the red point on design
        const currentPointIndex = parsedDataset.findIndex(
          // i => i.x === 261.18861840293226 && i.y === 0.7172208025193746
          i =>
            i.x === chartData.balanceInThousands[priceIndex] &&
            i.y === chartData.price[priceIndex]
        )
        const currentPoint = _metasets[0].dataset._points[currentPointIndex]
        if (!currentPoint) return
        const { x, y } = currentPoint
        const bottomY = scales.yAxes.bottom

        ctx.beginPath()
        ctx.arc(x, y, 8, 0, 2 * Math.PI, true)
        ctx.strokeStyle = '#F56969'
        ctx.stroke()
        ctx.fillStyle = '#F56969'
        ctx.fill()

        ctx.save()
        ctx.setLineDash([5, 3])
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x, bottomY)
        ctx.lineWidth = 2
        ctx.strokeStyle = '#F56969'
        ctx.stroke()
        ctx.restore()
      },
    },
  ]

  const leftContent = () => {
    return (
      <div>
        <MainTitle value="Bonding Curve" />
        <div
          css={`
            margin: 43.5px 0 0 0;
          `}
        >
          <Display title="Token Price" content={`${mintPrice} WXDAI`} />
          <Display
            title="Reserve Balance"
            content={`${
              reservePoolValue
                ? formatLocale(reservePoolValue).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : 0
            } WXDAI`}
          />
          <Display
            title="Reserve Ratio"
            content={collateralReserveRatio ? `${collateralReserveRatio}%` : 0}
          />
        </div>
      </div>
    )
  }

  const rightContent = () => {
    if (!account || !chartData || !priceIndex || !data)
      return (
        <div className="bg-transparent ml-6 mr-8 mt-16 p-8 w-full">
          <Image
            src={'/images/placeholders/bonding_curve.png'}
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
          chart={<Line data={data} options={options} plugins={plugins} />}
          xAxisLabel={<ChartAxisLabel label="reserve balance (wxDAI)" />}
          yAxisLabel={<ChartAxisLabel label="token price (wxdai)" rotate />}
        />
      </div>
    )
  }

  return (
    <SplitContainer leftContent={leftContent()} rightContent={rightContent()} />
  )
}

export default BondingCurve
