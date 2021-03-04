import * as V from 'victory'
import {useState} from "react";
import {Box} from "@material-ui/core";
import {debounce} from 'lodash'
import * as utils from '../../utils'

const GREY = '#808080'
const ALPHA_HALF = '80'

export const SimulationResultChart = (props) => {
    const {candles, orders} = props
    const [showDetails, setShowDetails] = useState()

    const [zoomDomain, setZoomDomain] = useState()
    const [brushDomain, setBrushDomain] = useState()

    const [candleRatio, setCandleRatio] = useState()

    candles.forEach(candle => {
        Object.assign(candle, {x: new Date(`${candle.date} ${candle.time}`)})
        Object.assign(candle, {y: candle.close})
    })

    orders.forEach(order => {
        const date = utils.kst(order.datetime)
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)

        Object.assign(order, {x: date})
        Object.assign(order, {y: order.price})
    })

    const getEntireDomain = () => {
        const begin = utils.kst(Math.min(...(candles.map(candle => candle.x))))
        const end = utils.kst(Math.max(...(candles.map(candle => candle.x))))

        begin.setDate(begin.getDate() - 2)
        end.setDate(end.getDate() + 2)

        return {
            x: [
                begin,
                end
            ],
            y: [
                Math.min(...(candles.map(candle => candle.low))),
                Math.max(...(candles.map(candle => candle.high)))
            ],
        };
    }

    const entireDomain = getEntireDomain()

    const calcCandleRatio = (domain) => {
        return  (entireDomain.x[1] - entireDomain.x[0]) / (domain.x[1] - domain.x[0]) * 0.5
    }

    const zoomDebounce = debounce((domain) => {
        setZoomDomain(domain)
        setCandleRatio(calcCandleRatio(domain))
    })

    const brushDebounce = debounce((domain) => {
        setBrushDomain(domain)
        setCandleRatio(calcCandleRatio(domain))
    })

    const handleZoom = (domain) => {
        brushDebounce(domain)
    }

    const handleBrush = (domain) => {
        zoomDebounce(domain)
    }

    const axisStyle = {
        axis: {stroke: 'grey'},
        grid: {stroke: GREY + ALPHA_HALF},
        tickLabels: {fontSize: 12, padding: 3, color: 'grey', fill: 'grey'},
    }

    return (
        <Box>
            <V.VictoryChart
                scale={{x: "time"}}
                domainPadding={{x: [10, 10]}}
                width={800}
                height={500}
                padding={{top: 50, left: 50, right: 0, bottom: 30}}
                containerComponent={
                    <V.VictoryZoomContainer
                        zoomDimension='x'
                        zoomDomain={zoomDomain}
                        onZoomDomainChange={domain => handleZoom(domain)}
                    />
                }
            >
                <V.VictoryAxis tickFormat={utils.dateToString} style={axisStyle}/>
                <V.VictoryAxis dependentAxis style={axisStyle}/>
                <V.VictoryCandlestick
                    candleRatio={candleRatio}
                    candleColors={{positive: "tomato", negative: "DodgerBlue"}}
                    data={candles}
                    style={{
                        data: {
                            strokeOpacity: 0.5,
                            stroke: 'white',
                            strokeWidth: 1
                        },
                        labels: {fill: "black", padding: 1},
                    }}

                    labels={({datum}) => `${utils.dateToString(datum.x)}\nopen: ${datum.open}\nhigh: ${datum.high}\nlow: ${datum.low}\nclose: ${datum.close}`}
                    labelComponent={<V.VictoryTooltip/>}
                    events={[{
                        target: "data",
                        eventHandlers: {
                            onMouseOver: (event) => {
                                setShowDetails(true)
                                return {
                                    target: "labels", mutation: () => ({active: true})
                                }
                            },
                            onMouseOut: () => {
                                setShowDetails(false)
                                return {
                                    target: "labels", mutation: () => ({active: false})
                                }
                            }
                        }
                    }]}
                />
                <V.VictoryScatter data={orders}
                                  style={{
                                      data: {fill: 'white', borderColor: 'white'}, labels: {fill: "white"}
                                  }}
                                  size={5}
                                  labels={(d) => {
                                      const {datetime, price, count, type} = d.datum
                                      return `${utils.timeToString(utils.kst(datetime))}\n${type} ×${count}\n₩${utils.numberWithCommas(price)}`
                                  }}
                                  labelComponent={
                                      <V.VictoryLabel
                                          dx={(xxx) => {
                                              return 0
                                          }}
                                          dy={(xxx) => {
                                              return -10
                                          }}
                                      />
                                  }
                />
            </V.VictoryChart>
            <V.VictoryChart
                domain={entireDomain}
                scale={{x: "time"}}
                domainPadding={{x: [10, 10]}}
                width={800}
                height={150}
                padding={{top: 0, left: 50, right: 0, bottom: 30}}
                containerComponent={
                    <V.VictoryBrushContainer
                        brushDimension="x"
                        brushDomain={brushDomain}
                        onBrushDomainChange={domain => handleBrush(domain)}
                    />
                }
            >
                <V.VictoryAxis tickFormat={utils.dateToString} style={axisStyle}/>
                <V.VictoryAxis dependentAxis style={axisStyle}/>
                <V.VictoryLine style={{data: {stroke: "tomato"}}}
                               data={candles.map(candle => ({x: candle.x, y: candle.close}))}/>
                <V.VictoryLine style={{data: {stroke: GREY + ALPHA_HALF}}}
                               data={candles.map(candle => ({x: candle.x, y: candle.low}))}/>
                <V.VictoryLine style={{data: {stroke: GREY + ALPHA_HALF}}}
                               data={candles.map(candle => ({x: candle.x, y: candle.high}))}/>
            </V.VictoryChart>
        </Box>
    )
}