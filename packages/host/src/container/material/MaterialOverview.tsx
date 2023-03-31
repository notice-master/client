import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useAppDispatch } from '@nmc/common';
import { useSubmit } from 'react-router-dom';

import { setModalConfig } from '../../redux/taskModalSlice';
import { CreateTaskModal } from '../../components';

const MaterialOverview = () => {
  const dispatch = useAppDispatch();
  const submit = useSubmit();
  useEffect(() => {}, []);
  return (
    <div>
      <Button
        onClick={() => {
          dispatch(
            setModalConfig({
              open: true,
            })
          );
        }}
      >
        创建任务
      </Button>
      <CreateTaskModal
        onConfirm={(taskId: string) => {
          const formData = new FormData();
          formData.append('taskId', taskId);
          submit(formData, { action: '/task/executor', method: 'post' });
        }}
      />
    </div>
  );
};
export default MaterialOverview;
