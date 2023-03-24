import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useAppDispatch } from '@nmc/common';
import { setModalStatus } from '../../redux/createTaskModalSlice';
import { CreateTaskModal } from '../../components';

const MaterialOverview = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {}, []);
  return (
    <div>
      <Button
        onClick={() => {
          dispatch(
            setModalStatus({
              open: true,
            })
          );
        }}
      >
        创建任务
      </Button>
      <CreateTaskModal />
    </div>
  );
};
export default MaterialOverview;
