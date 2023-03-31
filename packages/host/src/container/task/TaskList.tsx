import type { IDBPDatabase } from 'idb';
import { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import {
  EditTwoTone,
  DeleteTwoTone,
  PlayCircleTwoTone,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { ProcessHelper, initTask, getTaskManageDBInstance } from '../../utils';

const TaskList = () => {
  const [taskManageDB, setTaskManageDB] = useState<IDBPDatabase>();
  const [tasks, setTasks] = useState<ITaskRecord[]>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const initDB = async () => {
    setTaskManageDB(await getTaskManageDBInstance());
  };
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };
  const columns: ColumnsType<ITaskRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '进程数',
      dataIndex: 'threadCounts',
      key: 'threadCounts',
    },
    {
      title: '任务设置',
      dataIndex: 'taskConfig',
      key: 'taskConfig',
      render: (data) => {
        return JSON.stringify(data);
      },
    },
    {
      title: '默认请求参数',
      dataIndex: 'defaultRequestConfig',
      key: 'defaultRequestConfig',
      render: (data, { dataType }) => {
        if (dataType === 'template-message') {
          return '渲染模板消息';
        }
        return JSON.stringify(data);
      },
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
    },
    {
      title: '操作',
      align: 'center',
      key: 'action',
      render: () => {
        return (
          <>
            <Button type="text">
              <EditTwoTone />
            </Button>
            <Button type="text">
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </Button>
            <Button type="text">
              <PlayCircleTwoTone twoToneColor="#73d13d" />
            </Button>
          </>
        );
      },
    },
  ];

  const getDataByPage = async (pageNum: number, pageSize: number) => {
    const result = [];
    if (taskManageDB) {
      const tx = taskManageDB.transaction('tasks', 'readonly');
      let cursor = await tx.store.index('updateTime').openCursor(null, 'prev');
      let count = 1;
      while (cursor && result.length < pageSize) {
        if (count > (pageNum - 1) * pageSize && count <= pageNum * pageSize) {
          result.push({ ...cursor.value, key: cursor.value.id });
        }
        if (result.length >= pageSize) break;
        count++;
        cursor = await cursor.continue();
      }
    }
    return result;
  };

  useEffect(() => {
    initDB();
  }, []);
  useEffect(() => {
    if (taskManageDB) {
      const tx = taskManageDB.transaction('tasks', 'readonly');
      const { current = 1, pageSize = 10 } = pagination;
      tx.store.count().then((total) => {
        setPagination({ ...pagination, total });
      });
      getDataByPage(current, pageSize).then((data) => {
        setTasks(data);
      });
    }
  }, [taskManageDB, pagination.current, pagination.pageSize]);

  return (
    <Table
      columns={columns}
      pagination={pagination}
      dataSource={tasks}
      onChange={handleTableChange}
    />
  );
};

export default TaskList;
