import React, { useState, useEffect } from 'react';
import { Form, Modal, Input } from 'antd';
import type { IDBPDatabase } from '@nmc/idb';
import { getManageDBInstance } from '@nmc/idb';
import { nanoid } from 'nanoid';
import { useSelector, useAppDispatch, setModalConfig } from '@nmc/common';
import type {
  ITaskModalStore,
  ITaskModalConfig,
  GlobalState,
} from '@nmc/common';
interface ITaskModalProps {
  onConfirm: (taskId: string) => void;
}
export default ({ onConfirm }: ITaskModalProps) => {
  const dispatch = useAppDispatch();
  const { open, defaultRequestConfig } = useSelector<
    { taskModal: ITaskModalStore },
    ITaskModalConfig
  >((state) => state?.taskModal?.modalConfig || {});
  const { appId = '' } = useSelector<{ global: GlobalState }, GlobalState>(
    (state) => state?.global || {}
  );
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [taskManageDB, setTaskManageDB] = useState<IDBPDatabase>();
  const [taskId, setTaskId] = useState(nanoid());
  const handleConfirm = async () => {
    if (taskManageDB) {
      setConfirmLoading(true);
      await taskManageDB.add('tasks', {
        id: taskId,
        threadCounts: Number(form.getFieldValue('threadCounts')),
        taskConfig: {
          delay: 500,
          total: 83,
          taskId: taskId,
        },
        defaultRequestConfig: defaultRequestConfig,
        dataType: 'template-message',
        taskType: 'local',
        createTime: new Date(),
        updateTime: new Date(),
      } as ITaskRecord);
      dispatch(
        setModalConfig({
          open: false,
        })
      );
      setConfirmLoading(false);
      if (typeof onConfirm === 'function') {
        onConfirm(taskId);
      }
    }
  };
  const handleCancel = () => {
    dispatch(
      setModalConfig({
        open: false,
      })
    );
  };
  const initDB = async () => {
    const db = await getManageDBInstance(appId);
    db && setTaskManageDB(db);
  };

  useEffect(() => {
    initDB();
  }, []);

  useEffect(() => {
    if (!open) {
      setTaskId(nanoid());
    }
  }, [open]);
  return (
    <Modal
      open={open}
      title="创建任务"
      onOk={handleConfirm}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="horizontal"
        name="form_in_modal"
        initialValues={{ threadCounts: 10 }}
        component={false}
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
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
