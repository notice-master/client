import { setCurrentPageInfo, useAppDispatch } from '@nmc/common';
import { useEffect } from "react";

const HomePage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setCurrentPageInfo({
        title: '首页',
        subtitle: '',
      })
    );
  },[]);
  
  return (
    <div>
      Home page
    </div>
  );
};

export default HomePage;
