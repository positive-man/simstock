import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {Button, ButtonGroup, Container} from "@material-ui/core";
import axios from "axios";
import {api} from "../../Config";
import {SimulationResultChart} from "./SimulationResultChart";
import * as utils from '../../utils'
import {kst} from '../../utils'


const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

export class SimulationResultDetailModel {
    code: string
    name: string
    begin: Date
    end: Date
    candles: Array<any>
    events: Array<Event>
}

class Event {
    datetime: Date
    type: string
    price: number
    count: number
}


const SimulationEventTable = (props) => {
    return (
        <Container>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>시각</TableCell>
                        <TableCell>주문</TableCell>
                        <TableCell align="right">주문가(₩)</TableCell>
                        <TableCell align="right">주문수량</TableCell>
                        <TableCell align="right">주문총액(₩)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data?.events && props.data.events.map((event) => (
                        <TableRow key={event.datetime}>
                            <TableCell component="th"
                                       scope="row">{utils.datetimeToString(kst(event.datetime))}</TableCell>
                            <TableCell>{event.type}</TableCell>
                            <TableCell align="right">{utils.numberWithCommas(event.price)}</TableCell>
                            <TableCell align="right">{utils.numberWithCommas(event.count)}</TableCell>
                            <TableCell align="right">{utils.numberWithCommas(event.price * event.count)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    )
}

const SimulationEventChartWrapper = (props) => {
    const {events} = props.data
    const [candles, setCandles] = useState()

    const params = {
        code: props.data.code,
        chart_type: 'DAY',
        begin: props.data.begin,
        end: props.data.end
    }

    const initChart = async () => {
        if (candles) {
            return
        }

        const response = await axios.get(api('/charts'), {params})
        setCandles(response.data)
    }

    initChart()

    return (
        <Box>
            {candles && <SimulationResultChart candles={candles} orders={events}/>}
        </Box>

    )
}


const totalEarningRate = (events) => {
    if (events === null || events.length === 0) {
        return 0
    }

    let sumOfBuy = 0
    let sumOfSell = 0

    for (let event of events.filter(value => value.type === 'BUY')) {
        sumOfBuy += event.price * event.count
    }

    for (let event of events.filter(value => value.type === 'SELL')) {
        sumOfSell += event.price * event.count
    }

    return (sumOfSell - sumOfBuy) / sumOfBuy
}

const totalEarningPrice = (events) => {
    if (events === null) {
        return 0
    }

    let sum = 0
    for (let event of events.filter(value => value.type === 'BUY')) {
        sum -= event.price * event.count
    }

    for (let event of events.filter(value => value.type === 'SELL')) {
        sum += event.price * event.count
    }

    return sum
}


const Row = (props) => {
    const result: SimulationResultDetailModel = props.result
    const [open, setOpen] = React.useState(false);
    const [showChart, setShowChart] = useState()
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root} onClick={() => setOpen(!open)}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{result.code}</TableCell>
                <TableCell>{result.name}</TableCell>
                <TableCell align='right'>{(totalEarningRate(result.events) * 100).toFixed(1) + '%'}</TableCell>
                <TableCell align='right'>{'₩' + utils.numberWithCommas(totalEarningPrice(result.events))}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box display='flex' flexDirection='row-reverse' alignItems='center'>
                            <ButtonGroup color="primary">
                                <Button variant={!showChart ? 'contained' : 'outlined'}
                                        onClick={() => setShowChart(false)}>Table</Button>
                                <Button variant={showChart ? "contained" : 'outlined'}
                                        onClick={() => setShowChart(true)}>Chart</Button>
                            </ButtonGroup>
                        </Box>

                        <Box marginTop={5} marginBottom={5}>
                            {
                                showChart
                                    ? <SimulationEventChartWrapper data={result}/>
                                    : <SimulationEventTable data={result}/>
                            }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


const Card = (props) => {
    const {name, value} = props
    return <Box display='flex' justifyContent='center' marginLeft={5} marginRight={5}>
        <Box>
            <Box textAlign='center' fontWeight={1000} fontSize={40} color='gold'>
                {value}
            </Box>
            <Box textAlign='center' color='grey'>
                {name}
            </Box>
        </Box>
    </Box>
}


export function SimulationResultView(props) {
    const {results} = props
    let allEvents = []
    results.map(result => result.events).forEach(events => {
        allEvents = allEvents.concat(events)
    })
    return (
        <Container>
            <Box marginTop={5} marginBottom={5}>
                <Box display='flex' justifyContent='center'>
                    <Card name='평균 수익율(%)' value={(totalEarningRate(allEvents) * 100).toFixed(1)}/>
                    <Box style={{width: '1px', background: 'grey'}}/>
                    <Card name='총 수익금(₩)' value={utils.numberWithCommas(totalEarningPrice(allEvents))}/>
                </Box>
            </Box>
            <Box marginTop={1} marginBottom={1}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell>종목코드</TableCell>
                                <TableCell>종목명</TableCell>
                                <TableCell align="right">수익율(%)</TableCell>
                                <TableCell align="right">수익금(₩)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((result) => (
                                <Row result={result}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}