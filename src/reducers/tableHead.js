import { createSlice } from "@reduxjs/toolkit";

export const tableHeadSlice = createSlice({
    name:'tableHead',
    initialState:{
        value:[
                {
                    header:'Date',
                    value:'date'
                }, 
                {
                    header:'App Name',
                    value:'app_name'
                }, 
                {
                    header:'AD Request',
                    value:'requests'
                }, 
                {
                    header:'AD Response',
                    value:'responses'
                }, 
                {
                    header:'Impression',
                    value:'impressions'
                }, 
                {
                    header:'Clicks',
                    value:'clicks'
                }, 
                {
                    header:'Revenue',
                    value:'revenue'
                }, 
                {
                    header:'Fill Rate',
                    value:'fill_rate'
                }, 
                {
                    header:'CTR',
                    value:'ctr'
                }
            ]},
    reducers:{
        headerData:(state, action) => {
            state.value = action.payload;
        },
    },
});

export const { headerData } = tableHeadSlice.actions;

export default tableHeadSlice.reducer;