import styled from "styled-components";
import {DataGrid} from "@material-ui/data-grid";
import React, {useEffect, useState} from "react";
import {api} from "../Config";
import {Box, TextField} from "@material-ui/core";
import { debounce } from "lodash";


const columns = [
    {field: 'code', headerName: 'Code', width: 100},
    {field: 'name', headerName: 'Name', width: 250},
    {field: 'status', headerName: 'Status', width: 100},
];

const DataGridContainer = styled.div`
  height: 500px;
  width: 700px;
  display: grid;
`

const convertStockToRow = (stock) => {
    return Object.assign(stock, {id: stock.code})
}


export const StockSelector = (props) => {

    const [rows, setRows] = useState()
    const [filteredRows, setFilteredRows] = useState()
    // noinspection JSUnresolvedVariable
    const selectionCountLimit = props.selectionLimit || 30

    if (rows == null) {
        fetch(api('/stocks'))
            .then(response => response.json())
            .then(data => data.map(stock => convertStockToRow(stock)))
            .then((rows) => setRows(rows))
    }

    useEffect(() => {
        setFilteredRows(rows)
    }, [rows])

    const getStock = (code: string) => {
        for (let row of rows) {
            if (row.code === code) {
                return row
            }
        }
    }

    const handleSearchTextChange = (searchText) => {
        debounce(() => {
            const matches = rows.filter(row => {
                for(let text of [row.name, row.code]) {
                    if(text.toLowerCase().includes(searchText.toLowerCase())) {
                        return true
                    }
                }
            })

            setFilteredRows(matches)
        }, 300)()
    }

    useEffect(() => {
        setFilteredRows(rows)
    }, [rows])

    // noinspection RequiredAttributes
    return (
        <React.Fragment>
            <Box marginBottom={2}>
                <TextField id="standard-basic" label="검색"
                           onChange={event => handleSearchTextChange(event.target.value)}/>
            </Box>
            <DataGridContainer>
                {filteredRows == null ? null :
                    <DataGrid rows={filteredRows} columns={columns}
                              checkboxSelection
                              selectionModel={props.selection.map(value => value.code)}
                              onSelectionModelChange={(event) => {
                                  props.onSelectionChange(event.selectionModel
                                      .map(id => getStock(id))
                                      .filter(value => value != null)
                                      .splice(0, selectionCountLimit))
                              }}
                              pageSize={100}
                    />
                }
            </DataGridContainer>
        </React.Fragment>
    );
}