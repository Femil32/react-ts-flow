import { createSlice } from "@reduxjs/toolkit";

export type InputColumn = string[];
export type InputData = any[];

interface InitialState {
  inputColumns: string[];
  inputData: any[];
  outputColmuns: string[];
  outputData: string[];
}

const initialState = {
  inputColumns: ["aaa", "bbb"],
  inputData: [
    {
      aaa: "first name",
      bbb: "last anme",
    },
    {
      aaa: "aa first name",
      bbb: "bb second anme",
    },
    {
      aaa: "gg first name",
      bbb: "gh second anme",
    },
  ],
  outputColmuns: [],
  outputData: [],
} as InitialState;

export const userInputData = createSlice({
  name: "fileData",
  initialState,
  reducers: {
    reset: () => initialState,
    setInputColumns: (state, action) => {
      console.log(state, action);
      const columns = action.payload;

      state.inputColumns = columns;
    },
    setInputData: (state, action) => {
      console.log(state, action);

      // const data = action.payload;
      // state.inputData = data;
    },
    setOutputColumns: (state, action) => {
      const columns = action.payload;
      state.outputColmuns = columns;
    },
    setOutputData: (state, action) => {
      const data = action.payload;
      state.outputData = data;
    },
  },
});

export const {
  reset,
  setInputColumns,
  setInputData,
  setOutputColumns,
  setOutputData,
  // reactFlowInstance
} = userInputData.actions;

export default userInputData.reducer;
