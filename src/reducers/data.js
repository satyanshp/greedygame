import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
    name:'data',
    initialState:{value:[]},
    reducers:{
        dateData:(state, action) => {
            state.value = action.payload;
        },
    },
});

export const { dateData } = dataSlice.actions;

export default dataSlice.reducer;