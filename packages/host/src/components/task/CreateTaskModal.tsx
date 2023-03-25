import React, { useState, useEffect } from 'react';
import { Form, Modal, Input } from 'antd';
import { IDBPDatabase } from 'idb';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import createTaskModalReducer, {
  setModalStatus,
  ICreateTaskModalConfig,
  IModalStatus,
} from '../../redux/createTaskModalSlice';
import { useInjectReducer, useSelector, useAppDispatch } from '@nmc/common';
import { getTaskManageDBInstance, initTask } from '../../utils';
import { TASK_MANAGE_DB_NAME } from '../../constants';

export default () => {
  useInjectReducer({ key: 'createTaskModal', reducer: createTaskModalReducer });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modalStatus = useSelector<
    { createTaskModal: ICreateTaskModalConfig },
    IModalStatus
  >((state) => state?.createTaskModal?.modalStatus);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [taskManageDB, setTaskManageDB] = useState<IDBPDatabase>();
  const [taskID] = useState(nanoid());
  const handleConfirm = async () => {
    if (taskManageDB) {
      setConfirmLoading(true);
      await taskManageDB.add('tasks', {
        id: taskID,
        threadCounts: form.getFieldValue('threadCounts'),
      });
      dispatch(
        setModalStatus({
          open: false,
        })
      );
      navigate(`/task/executor/${taskID}/`);
    }
  };
  const handleCancel = () => {
    dispatch(
      setModalStatus({
        open: false,
      })
    );
  };
  const initDB = async () => {
    setTaskManageDB(await getTaskManageDBInstance());
  };
  useEffect(() => {
    initDB();
  }, []);
  return (
    <Modal
      open={modalStatus?.open}
      title="创建任务"
      onOk={handleConfirm}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form
        action="/task/executor"
        method="post"
        form={form}
        layout="horizontal"
        name="form_in_modal"
        initialValues={{ threadCounts: 10 }}
      >
        <Form.Item
          name="threadCounts"
          label="进程数"
          rules={[
            {
              required: true,
              message: '请输入一个正确的进程数!',
            },
          ]}
        >
          <Input value={10} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
