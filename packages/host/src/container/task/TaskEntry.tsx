import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TaskOverview from './TaskOverview';
import TaskList from './TaskList';

const Entry = () => {
  return (
    <Routes>
      <Route path={`overview`} element={<TaskOverview />}></Route>
      <Route path={`list`} element={<TaskList />}></Route>
      {/* <Route path="*" element={<Navigate to="./overview" />} /> */}
    </Routes>
  );
};

export default Entry;
