import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IModalConfig {
  open: boolean;
}
export interface ITaskModalStore {
  modalConfig: IModalConfig;
}

const initialState: ITaskModalStore = {
  modalConfig: { open: false },
};

export const taskModalSlice = createSlice({
  name: 'taskModal',
  initialState,
  reducers: {
    setModalConfig: (state, action: PayloadAction<IModalConfig>) => {
      state.modalConfig = {
        ...state.modalConfig,
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModalConfig } = taskModalSlice.actions;

export default taskModalSlice.reducer;
