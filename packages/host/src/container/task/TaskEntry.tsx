import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TaskExecutor from './TaskExecutor';

const Entry = () => {
  return (
    <Routes>
      <Route path={`executor`} element={<TaskExecutor />}></Route>
      <Route path="*" element={<Navigate to="executor" />} />
    </Routes>
  );
};
export default Entry;
