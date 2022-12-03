import { CommonProviders } from '@nmc/common';
// import axios from 'axios';
import Framework from './container/Framework';
import './styled/global.css';
export interface CustomMessage {
  [key: string]: string;
}
const App = () => {
  return (
    <CommonProviders>
      <Framework />
    </CommonProviders>
  );
};

export default App;
