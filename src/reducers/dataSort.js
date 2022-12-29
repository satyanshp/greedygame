import { createSlice } from "@reduxjs/toolkit";

export const tableDataSortSlice = createSlice({
    name:'dataSort',
    initialState:{
        value:
        [
            'date', 
            'app_id', 
            'requests', 
            'responses', 
            'impressions', 
            'clicks', 
            'revenue', 
            'fill_rate', 
            'ctr',
        ]},
    reducers:{
        tableDataSort:(state, action) => {
            state.value = action.payload;
        },
    },
});

export const { tableDataSort } = tableDataSortSlice.actions;

export default tableDataSortSlice.reducer;