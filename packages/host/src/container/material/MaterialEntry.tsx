import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MaterialOverview from './MaterialOverview';

const MaterialEntry = () => {
  return (
    <Routes>
      <Route path={`overview`} element={<MaterialOverview />}></Route>
      <Route path="*" element={<Navigate to="overview" />} />
    </Routes>
  );
};
export default MaterialEntry;
