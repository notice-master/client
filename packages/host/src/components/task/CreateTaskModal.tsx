import React, { useState, useEffect } from 'react';
import { Form, Modal, Input } from 'antd';
import { IDBPDatabase } from 'idb';
import { nanoid } from 'nanoid';
import { useSubmit } from 'react-router-dom';
import createTaskModalReducer, {
  setModalStatus,
  ICreateTaskModalConfig,
  IModalStatus,
} from '../../redux/createTaskModalSlice';
import { useInjectReducer, useSelector, useAppDispatch } from '@nmc/common';
import { getTaskManageDBInstance, initTask } from '../../utils';

export default () => {
  useInjectReducer({ key: 'createTaskModal', reducer: createTaskModalReducer });
  const dispatch = useAppDispatch();
  const submit = useSubmit();
  const modalStatus = useSelector<
    { createTaskModal: ICreateTaskModalConfig },
    IModalStatus
  >((state) => state?.createTaskModal?.modalStatus);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [taskManageDB, setTaskManageDB] = useState<IDBPDatabase>();
  const [taskId] = useState(nanoid());
  const handleConfirm = async () => {
    if (taskManageDB) {
      setConfirmLoading(true);
      await taskManageDB.add('tasks', {
        id: taskId,
        threadCounts: form.getFieldValue('threadCounts'),
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
        updateTIme: new Date(),
      } as ITaskRecord);
      dispatch(
        setModalStatus({
          open: false,
        })
      );
      const formData = new FormData();
      formData.append('taskId', taskId);
      formData.append('threadCounts', form.getFieldValue('threadCounts'));
      submit(formData, { action: '/task/executor', method: 'post' });
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
          <Input value={10} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
