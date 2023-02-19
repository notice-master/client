import { openDB, setCurrentPageInfo, useAppDispatch } from '@nmc/common';
import { Button, Col, Input, Row, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import useBeforeUnload from 'use-before-unload';
import TaskWorker from '../../components/TaskWorker';

type WorkerPoolType = {
  [key: string]: { key: string; taskHelper?: TaskHelperInterface };
};

async function doDatabaseStuff() {
  const db = await openDB('testDB', 1, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
      const store = db.createObjectStore('testStore', {
        keyPath: 'id',
        autoIncrement: true
      });
      store.createIndex('date', 'date');
    },
    blocked(currentVersion, blockedVersion, event) {
    },
    blocking(currentVersion, blockedVersion, event) {
    },
    terminated() {
    },
  });
  // db.put('test', 'testKey', 1)
  await db.add('testStore', {
    title: 'Article 1',
    date: new Date('2019-01-01'),
    body: '…',
  });

  const tx = db.transaction('testStore', 'readwrite');
  await Promise.all([
    tx.store.add({
      title: 'Article 2',
      date: new Date('2019-01-01'),
      body: '…',
    }),
    tx.store.add({
      title: 'Article 3',
      date: new Date('2019-01-02'),
      body: '…',
    }),
    tx.done,
  ]);
  console.log(await db.getAllFromIndex('testStore', 'date'));
}

const TaskExecutor = () => {
  const dispatch = useAppDispatch();
  const [threadCounts, setThreadCounts] = useState(10);
  const [defaultTaskSets, setDefaultTaskSets] = useState({
    url: 'https://w.1717shua.cn/addons/zjl_mass_tpl_msg/apiAgent.php',
    // url: 'https://agent.1717shua.cn/cgi-bin/template/api_add_template',
    delay: 0,
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
    total: 50,
    finished: 0,
  });
  const [state, setState] = useState(false);
  const [workerPool, setWorkerPool] = useState<WorkerPoolType>({});
  useBeforeUnload((event) => {
    if(state) {
      return '任务已创建,确定要离开?';
    } else {
      return true;
    }
  });
  const init = () => {
    if (!state) {
      setState(true);
      console.log('threadCounts: ', threadCounts);
      const tasksObj: WorkerPoolType = {};
      new Array(threadCounts).fill('').forEach(() => {
        const key = Math.random().toString(32).substring(3);
        tasksObj[key] = { key };
      });
      setWorkerPool(tasksObj);
      
    }
  };
  const reset = () => {
    setState(false);
  };
  const testPush = () => {
    Object.values(workerPool).forEach(({ taskHelper }) => {
      if (!taskHelper) return;
      taskHelper.push(
        new Array(50).fill({
          params: {
            touser: Math.random().toString(32),
          },
        })
      );
    });
  };
  const run = () => {
    Object.values(workerPool).forEach(({ taskHelper }) => {
      if (!taskHelper) return;
      taskHelper.run();
    });
  };
  const pause = () => {
    Object.values(workerPool).forEach(({ taskHelper }) => {
      if (!taskHelper) return;
      taskHelper.pause();
    });
  };
  useEffect(() => {
    dispatch(
      setCurrentPageInfo({
        title: '任务执行器',
        subtitle: '',
      })
    );
    doDatabaseStuff();
  }, []);

  const isAllWorkerReady = useMemo(() => {
    const values = Object.values(workerPool);
    if (!values.length) return false;
    return values.every(({ taskHelper }) => {
      return !!taskHelper;
    });
  }, [workerPool]);

  return (
    <Spin spinning={state && !isAllWorkerReady} size="large" tip={'正在创建任务....'}>
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
                defaultTaskSets={defaultTaskSets}
                onWorkerReady={(
                  taskHelper: TaskHelperInterface,
                  id: string
                ) => {
                  workerPool[id].taskHelper = taskHelper;
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
