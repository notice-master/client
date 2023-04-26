import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';

export interface ITaskModalConfig {
  open: boolean;
  defaultRequestConfig?: AxiosRequestConfig;
}
export interface ITaskModalStore {
  modalConfig: ITaskModalConfig;
}

const initialState: ITaskModalStore = {
  modalConfig: { open: false },
};

export const taskModalSlice = createSlice({
  name: 'taskModal',
  initialState,
  reducers: {
    setModalConfig: (state, action: PayloadAction<ITaskModalConfig>) => {
      state.modalConfig = {
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModalConfig } = taskModalSlice.actions;

export default taskModalSlice.reducer;
