import React, { useState, useEffect } from 'react';
import { Form, Modal, Input } from 'antd';
import type { IDBPDatabase } from '@nmc/idb';
import { getTaskManageDBInstance } from '@nmc/idb';
import { nanoid } from 'nanoid';
import { useSelector, useAppDispatch, setModalConfig } from '@nmc/common';
import type { ITaskModalStore, IModalConfig } from '@nmc/common';
interface ITaskModalProps {
  onConfirm: (taskId: string) => void;
}
export default ({ onConfirm }: ITaskModalProps) => {
  const dispatch = useAppDispatch();
  const { open } = useSelector<{ taskModal: ITaskModalStore }, IModalConfig>(
    (state) => state?.taskModal?.modalConfig || {}
  );
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [taskManageDB, setTaskManageDB] = useState<IDBPDatabase>();
  const [taskId] = useState(nanoid());
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
        defaultRequestConfig: {
          url: 'https://w.1717shua.cn/addons/zjl_mass_tpl_msg/apiAgent.php',
          params: {
            api: 'message/template/send',
            access_token: 'test_token',
          },
          data: {
            touser: 'ot7Ngwyd0fEwZqq_DCZ6Yt9xQ6Qc',
            template_id: 'f1DPMaEr-Q8WRYxmgxG67YCD8zoOOuyJCpel1OJEax0',
            url: '',
            miniprogram: { appid: '', pagepath: '' },
            data: {
              first: { value: '', color: '#000000' },
              keyword1: { value: '', color: '#000000' },
              keyword2: { value: '', color: '#000000' },
              remark: { value: '', color: '#000000' },
            },
          },
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
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
    setTaskManageDB(await getTaskManageDBInstance());
  };

  useEffect(() => {
    initDB();
  }, []);

  useEffect(() => {
    if (!open) {
      console.log(
        '🚀 ~ file: CreateTaskModal.tsx:96 ~ useEffect ~ open:',
        open
      );
    }
  }, [open]);
  return (
    <Modal
      open={open}
      title="创建任务"
      onOk={handleConfirm}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
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
