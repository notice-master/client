import { useAppDispatch, useInjectReducer } from '@nmc/common';
import React, { useEffect } from 'react';
import reducer from '../redux/slice';

const TemplateMessageOverview = () => {
  useInjectReducer({ key: 'template-message', reducer });
  const dispatch = useAppDispatch();
  useEffect(() => {}, []);
  return (
    <>
      <h1>this is TemplateMessageOverview</h1>
    </>
  );
};

export default TemplateMessageOverview;
