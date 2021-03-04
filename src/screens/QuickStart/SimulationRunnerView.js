import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, LinearProgress, Typography} from "@material-ui/core";
import axios from "axios";
import {api} from "../../Config"
import {useSnackbar} from "notistack";
import {Skeleton} from "@material-ui/lab";
import {SimulationResultView} from "./SimulationResultView";


const SimulationStatus = {
    NOT_STARTED: 'NOT_STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR'
}


const ProgressBar = (props) => {
    return (
        <Box width="100%">
            <LinearProgress variant="determinate" {...props} />
        </Box>
    );
}


const dateToString = (obj: Date): String => {
    return [
        obj.getFullYear(),
        (obj.getMonth() + 1).toString().padStart(2, '0'),
        obj.getDate().toString().padStart(2, '0')
    ].join('-')
}

export const SimulationRunnerView = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {stockCodes, begin, end, strategy, stopLine, earningLine} = props
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState(SimulationStatus.NOT_STARTED)
    const [results, setResults] = useState([])

    const postSimulations = async () => {
        const total = stockCodes.length
        let worked = 0;
        setStatus(SimulationStatus.IN_PROGRESS)
        try {
            for (let code of stockCodes) {
                const result = await axios.post(api('/simulations'), {
                    code: code,
                    begin: dateToString(begin),
                    end: dateToString(end),
                    earning_line: earningLine,
                    stop_line: stopLine,
                    strategy: ''
                })

                results.push(result.data)
                setResults(results)

                worked++
                setProgress(worked / total)
            }

            enqueueSnackbar('Completed', {variant: 'success'});
            setStatus(SimulationStatus.COMPLETED)
        } catch (e) {
            enqueueSnackbar(e.toString(), {variant: 'error'});
            setStatus(SimulationStatus.ERROR)
        }
    }

    const reset = () => {
        setStatus(SimulationStatus.NOT_STARTED)
        setResults([])
        setProgress(0)
    }

    let errorMsg
    if (stockCodes == null || stockCodes.length === 0) errorMsg = '선택된 종목이 없습니다.'
    else if (begin >= end) errorMsg = '시뮬레이션 시작일을 종료일보다 작게 설정하세요.'
    else if (stopLine > 0) errorMsg = '손절 라인을 0보다 작게 설정하세요.'

    return (
        status === SimulationStatus.NOT_STARTED &&
        <Box>
            <Box display='flex' justifyContent='center' marginTop={3}>
                <Button disabled={errorMsg != null} variant='contained' color='primary' onClick={postSimulations}>
                    실행
                </Button>
            </Box>
            <Box display='flex' justifyContent='center' paddingTop={1}>
                {
                    errorMsg
                        ? <Typography color='error'>{errorMsg}</Typography>
                        : <Typography>지금 바로 시작하세요</Typography>
                }
            </Box>
        </Box>

        || status === SimulationStatus.IN_PROGRESS &&
        <Box>
            <Skeleton variant="rect" width='100%' height={300}>
                <Button variant='outlined' color='secondary' onClick={() => setStatus(SimulationStatus.NOT_STARTED)}>
                    취소
                </Button>
            </Skeleton>
            <ProgressBar value={progress * 100}/>
            <Box mt={1} display='flex' flexDirection='row-reverse'>
                <Button variant='outlined' color='secondary' onClick={() => setStatus(SimulationStatus.NOT_STARTED)}>
                    취소
                </Button>
            </Box>
        </Box>

        || status === SimulationStatus.ERROR &&
        <Box display='flex' alignItems='center' marginTop={3}>
            <Typography color='error'>서버로부터 오류가 발생했습니다.</Typography>
            <Box display='flex' justifyContent='center' paddingTop={5}>
                <Button variant='contained' color='primary' onClick={reset}>
                    초기화
                </Button>
            </Box>
        </Box>

        || status === SimulationStatus.COMPLETED && results &&
        <Box>
            <SimulationResultView results={results}/>
            <Box display='flex' justifyContent='center' paddingTop={5}>
                <Button variant='contained' color='primary' onClick={reset}>
                    초기화
                </Button>
            </Box>
        </Box>
    )
}
