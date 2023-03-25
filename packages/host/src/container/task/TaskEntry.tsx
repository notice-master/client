import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TaskOverview from './TaskOverview';
import TaskExecutor from './TaskExecutor';

const Entry = () => {
  return (
    <Routes>
      <Route path={`overview`} element={<TaskOverview />}></Route>
      <Route path={`executor`}>
        <Route path={`:taskId`} element={<TaskExecutor />}></Route>
      </Route>
      <Route path="*" element={<Navigate to="overview" />} />
    </Routes>
  );
};
export default Entry;
