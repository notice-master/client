import { Navigate, Route, Routes } from 'react-router-dom';
import { EditPage, MaterialList } from './containers';

const App = () => {
  return (
    <Routes>
      <Route path={`edit`} element={<EditPage />}></Route>
      <Route path={`list`} element={<MaterialList />}></Route>
      <Route path={`*`} element={<Navigate replace to={`list`} />} />
    </Routes>
  );
};
export default App;
