import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import createTaskModalReducer, {
  setModalStatus,
  ICreateTaskModalConfig,
  IModalStatus,
} from '../../redux/createTaskModalSlice';
import { useInjectReducer, useSelector, useAppDispatch } from '@nmc/common';

export default () => {
  useInjectReducer({ key: 'createTaskModal', reducer: createTaskModalReducer });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modalStatus = useSelector<
    { createTaskModal: ICreateTaskModalConfig },
    IModalStatus
  >((state) => state?.createTaskModal?.modalStatus);
  const handleConfirm = () => {
    dispatch(
      setModalStatus({
        open: false,
      })
    );
    navigate('/task/executor');
  };
  const handleCancel = () => {
    dispatch(
      setModalStatus({
        open: false,
      })
    );
  };
  return (
    <Modal
      open={modalStatus?.open}
      title="创建任务"
      onOk={handleConfirm}
      onCancel={handleCancel}
    ></Modal>
  );
};
