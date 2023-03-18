import { setCurrentPageInfo, useAppDispatch } from '@nmc/common';
import { IDBPDatabase, openDB } from 'idb';
import { Button, Col, Input, Row, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import useBeforeUnload from 'use-before-unload';
import { AxiosRequestConfig } from 'axios';
import TaskWorker from '../../components/TaskWorker';
import { getTaskDBInstance, ProcessHelper, initTask } from '../../utils';
import { INDEXED_STORE_PREFIX, TaskStatus } from 'src/constants';

const TaskExecutor = () => {
  const dispatch = useAppDispatch();
  const [threadCounts, setThreadCounts] = useState(10);
  const [db, setDB] = useState<IDBPDatabase>();
  const [config, setConfig] = useState({
    delay: 500,
    total: 83,
    finished: 0,
    taskId: '1',
  });
  const [defaultRequestConfig, setDefaultRequestConfig] =
    useState<AxiosRequestConfig>({
      url: 'https://w.1717shua.cn/addons/zjl_mass_tpl_msg/apiAgent.php',
      // url: 'https://agent.1717shua.cn/cgi-bin/template/api_add_template',
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
    });
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
    if (!state) {
      setState(true);
      const { db, workerPool } = await initTask(config.taskId, threadCounts);
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
      const storeName = `${INDEXED_STORE_PREFIX}${index + 1}`;
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
  useEffect(() => {
    dispatch(
      setCurrentPageInfo({
        title: '任务执行器',
        subtitle: '',
      })
    );
  }, []);

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
        <Col>进程数:</Col>
        <Col>
          <Input
            type="text"
            value={threadCounts}
            onChange={({ target }) => {
              const { value = 0 } = target;
              setThreadCounts(Number(value) || 0);
            }}
            style={{ width: 60 }}
          />
        </Col>
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
          Object.keys(workerPool).map((key: string, index: number) => {
            const workerObj = workerPool[key];
            return (
              <TaskWorker
                id={workerObj.key}
                key={workerObj.key}
                index={index + 1}
                config={{
                  ...config,
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
