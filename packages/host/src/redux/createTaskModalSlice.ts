import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IModalStatus {
  open: boolean;
}
export interface ICreateTaskModalConfig {
  modalStatus: IModalStatus;
}

const initialState: ICreateTaskModalConfig = {
  modalStatus: { open: false },
};

export const createTaskModalSlice = createSlice({
  name: 'createTaskModal',
  initialState,
  reducers: {
    setModalStatus: (state, action: PayloadAction<IModalStatus>) => {
      state.modalStatus = {
        ...state.modalStatus,
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModalStatus } = createTaskModalSlice.actions;

export default createTaskModalSlice.reducer;
