import { useAppDispatch } from '@nmc/common';
import type { IDBPDatabase } from 'idb';
import { Button, Col, Input, Row, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import useBeforeUnload from 'use-before-unload';
import { AxiosRequestConfig } from 'axios';
import { useActionData, Navigate } from 'react-router-dom';
import TaskWorker from '../../components/TaskWorker';
import { ProcessHelper, initTask, getTaskManageDBInstance } from '../../utils';
import { PROCESS_STORE_PREFIX, TaskStatus } from 'src/constants';

const TaskExecutor = () => {
  const [taskManageDB, setTaskManageDB] = useState<IDBPDatabase>();
  const actionData = useActionData() as TCreateTaskFormData;
  if (!actionData) {
    return <Navigate replace to="../task/overview" />;
  }
  const { taskId, threadCounts } = actionData;
  const [db, setDB] = useState<IDBPDatabase>();
  const [taskConfig, setTaskConfig] = useState<TTaskConfig>();
  const [defaultRequestConfig, setDefaultRequestConfig] =
    useState<AxiosRequestConfig>();
  const [state, setState] = useState(false);
  const [workerPool, setWorkerPool] = useState<WorkerPoolType>({});
  useBeforeUnload((event) => {
    if (state) {
      return '任务已创建,确定要离开?';
    } else {
      return true;
    }
  });
  const init = async () => {
    if (!state && taskConfig?.taskId) {
      setState(true);
      const { db, workerPool } = await initTask(
        taskConfig.taskId,
        threadCounts
      );
      setDB(db);
      setWorkerPool(workerPool);
    }
  };
  const reset = () => {
    setState(false);
  };
  const testPush = () => {
    Object.values(workerPool).forEach(async ({ processHelper }, index) => {
      if (!processHelper || !db) return;
      const storeName = `${PROCESS_STORE_PREFIX}${index + 1}`;
      const tx = db.transaction(storeName, 'readwrite');
      const tasks = new Array(10).fill('').map(() => {
        const openid = Math.random().toString(32).substring(3);
        return tx.store.add({
          id: openid,
          config: {
            params: {
              touser: openid,
            },
          },
          status: TaskStatus.pending,
        });
      });
      await Promise.all([...tasks, tx.done]);
    });
  };
  const run = () => {
    Object.values(workerPool).forEach(({ processHelper }) => {
      if (!processHelper) return;
      processHelper.run();
    });
  };
  const pause = () => {
    Object.values(workerPool).forEach(({ processHelper }) => {
      if (!processHelper) return;
      processHelper.pause();
    });
  };
  const initDB = async () => {
    setTaskManageDB(await getTaskManageDBInstance());
  };
  useEffect(() => {
    initDB();
  }, []);
  useEffect(() => {
    if (taskManageDB) {
      taskManageDB
        .transaction('tasks', 'readonly')
        .store.index('id')
        .get(taskId)
        .then((data) => {
          const { taskConfig, defaultRequestConfig } = data;
          setTaskConfig(taskConfig);
          setDefaultRequestConfig(defaultRequestConfig);
        });
    }
  }, [taskManageDB]);

  const isAllWorkerReady = useMemo(() => {
    const values = Object.values(workerPool);
    if (!values.length) return false;
    return values.every(({ processHelper }) => {
      return !!processHelper;
    });
  }, [workerPool]);

  return (
    <Spin
      spinning={state && !isAllWorkerReady}
      size="large"
      tip={'正在创建任务....'}
    >
      <Row gutter={5} align="middle">
        <Col>
          <Button type="primary" onClick={init} disabled={state}>
            初始化
          </Button>
        </Col>
        <Col>
          <Button type="primary" onClick={reset} disabled={!state}>
            重置
          </Button>
        </Col>
      </Row>

      <div>
        Controlled by parent:
        <br />
        <Button type="primary" onClick={testPush} disabled={!isAllWorkerReady}>
          testPush
        </Button>
        <Button type="primary" onClick={run} disabled={!isAllWorkerReady}>
          run
        </Button>
        <Button type="primary" onClick={pause} disabled={!isAllWorkerReady}>
          pause
        </Button>
      </div>
      <div>
        {state &&
          taskConfig?.taskId &&
          defaultRequestConfig &&
          Object.keys(workerPool).map((key: string, index: number) => {
            const workerObj = workerPool[key];
            return (
              <TaskWorker
                id={workerObj.key}
                key={workerObj.key}
                index={index + 1}
                config={{
                  ...taskConfig,
                  processId: (index + 1).toString(),
                }}
                defaultRequestConfig={defaultRequestConfig}
                onWorkerReady={(processHelper: ProcessHelper, id: string) => {
                  workerPool[id].processHelper = processHelper;
                  setWorkerPool({ ...workerPool });
                }}
                onDestroy={(id) => {
                  delete workerPool[id];
                  setWorkerPool({ ...workerPool });
                }}
              />
            );
          })}
      </div>
    </Spin>
  );
};

export default TaskExecutor;
