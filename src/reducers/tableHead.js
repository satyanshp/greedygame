import { createSlice } from "@reduxjs/toolkit";

export const tableHeadSlice = createSlice({
    name:'tableHead',
    initialState:{value:['Date', 'App Name', 'AD Request', 'AD Response', 'Impression', 'Clicks', 'Revenue', 'Fill Rate', 'CTR']},
    reducers:{
        headerData:(state, action) => {
            state.value = action.payload;
        },
    },
});

export const { headerData } = tableHeadSlice.actions;

export default tableHeadSlice.reducer;