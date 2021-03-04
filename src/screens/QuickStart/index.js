import {
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    DialogTitle,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup,
    Slider,
    Typography
} from "@material-ui/core";
import styled from 'styled-components';
import React, {useEffect, useState} from "react";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import {StockSelector} from "../../components/StockSelector";
import {SimulationRunnerView} from "./SimulationRunnerView";

const CustomHr = styled.hr`
  opacity: 0.2;
`

const SimulationSettingItem = (props) => {
    return <Box display='flex' paddingBottom={1}>
        <Box minWidth={100}>
            <Typography variant='subtitle2'>
                {props.title}
            </Typography>
        </Box>
        <Box width={20}/>
        <Box>
            {props.children}
        </Box>

    </Box>
}

const SAMSUNG = {
    name: '삼성전자',
    code: '005930',
    active: true
}

const X = {
    name: '푸드웰',
    code: '005670',
    active: true
}

const DatePicker = (props) => {
    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
            format="yyyy-MM-dd"
            margin="normal"
            label={props.label}
            value={props.value}
            onChange={props.onChange}
        />
    </MuiPickersUtilsProvider>
}


const StockChipWrapper = (props) => {
    return <Box paddingRight={1} paddingBottom={1}>
        <Chip {...props}/>
    </Box>
}

export const QuickStart = () => {
    const initialEnd = new Date()
    initialEnd.setDate(initialEnd.getDate() - 1)
    const initialBegin = new Date()
    initialBegin.setMonth(initialBegin.getMonth() - 3)

    const [selectedStocks, setSelectedStocks] = useState([X])
    const [begin: Date, setBegin] = useState(initialBegin)
    const [end: Date, setEnd] = useState(initialEnd)
    const [stopLine, setStopLine] = useState(-5)
    const [earningLine, setEarningLine] = useState(10)
    // const [strategy, setStrategy] = useState()
    const [openStockSelection, setOpenStockSelection] = useState(false)

    const deselectStock = (stock) => {
        setSelectedStocks(selectedStocks.filter(value => value !== stock))
    }

    const validate = () => {

        const ErrorMsg = (props) => <Typography color='error'>{props.msg}</Typography>

        if (selectedStocks == null || selectedStocks.length === 0) {
            return <ErrorMsg msg='종목을 선택하세요.'/>
        }

        if (begin > end) {
            return <ErrorMsg msg='시뮬레이션 시작일을 종료일보다 작게 설정하세요.'/>
        }

        if (stopLine > 0) {
            return <ErrorMsg msg='손절 라인을 0보다 작게 설정하세요.'/>
        }

        return <Typography>지금 바로 시뮬레이션을 시작하세요.</Typography>
    }

    return <Container maxWidth='md'>
        <Box margin={3}/>
        <Typography variant={"h3"}>
            Quick Start
        </Typography>
        <Typography variant={"subtitle2"}>
            단, 5분 만에 당신의 전략을 시뮬레이션 합니다.
        </Typography>
        <Box margin={5}/>
        <SimulationSettingItem title='종목'>
            <Box display='flex' flexWrap='wrap'>
                {
                    selectedStocks.map(
                        stock => (
                            <StockChipWrapper
                                label={stock.name}
                                onDelete={() => deselectStock(stock)}
                                variant="outlined"
                                color='primary'
                            />
                        )
                    )
                }
                <StockChipWrapper label="Add" color='primary' clickable
                                  onClick={() => setOpenStockSelection(true)}
                />
            </Box>
            <Dialog maxWidth='lg' open={openStockSelection} onClose={_ => setOpenStockSelection(false)}>
                <DialogTitle>종목 추가</DialogTitle>
                <Box padding={2}>
                    <StockSelector selection={selectedStocks} onSelectionChange={setSelectedStocks}/>
                    <Box display='flex' flexDirection='row-reverse' marginTop={2}>
                        <Button variant='contained' color='primary' onClick={() => setOpenStockSelection(false)}>
                            완료
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </SimulationSettingItem>
        <CustomHr/>
        <SimulationSettingItem title='기간'>
            <Box display='flex'>
                <DatePicker label="시작일"
                            value={begin}
                            onChange={setBegin}/>
                <Box margin={1}/>
                <DatePicker label="종료일"
                            value={end}
                            onChange={setEnd}/>
            </Box>
        </SimulationSettingItem>
        <CustomHr/>
        <SimulationSettingItem title='손익절 라인'>
            <Box width={400}>
                <Slider
                    track="inverted"
                    scale={(x) => (x / 2 - 25)}
                    getAriaValueText={_ => 'text'}
                    defaultValue={[stopLine * 2 + 50, earningLine * 2 + 50]}
                    onChange={(_, values) => {
                        setStopLine(values[0] / 2 - 25)
                        setEarningLine(values[1] / 2 - 25)
                    }}
                    marks
                    valueLabelDisplay="auto"
                />
                {stopLine} 이하 손절 | {earningLine} 이상 익절
            </Box>
        </SimulationSettingItem>
        <CustomHr/>
        <SimulationSettingItem title='전략'>
            <Box>
                <RadioGroup value={"5MA 상향터치"} onChange={event => null}>
                    <FormControlLabel value="5MA 상향터치" control={<Radio/>} label="5MA 상향터치"/>
                    <FormControlLabel value="골든&데드 크로스" control={<Radio/>} label="골든&데드 크로스" disabled={true}/>
                </RadioGroup>
                <hr/>
                <FormHelperText>정배열 상태 & 전일 5MA 상향 터치 시 매수</FormHelperText>
            </Box>
        </SimulationSettingItem>

        <hr/>
        {
            <SimulationRunnerView
                stockCodes={selectedStocks.map(stock => stock.code)}
                begin={begin}
                end={end}
                earningLine={earningLine}
                stopLine={stopLine}
            />
        }

    </Container>
}

