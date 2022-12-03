import { setCurrentPageInfo, useAppDispatch } from '@nmc/common';
import { Button, Col, Input, Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import TaskWorker from '../../components/TaskWorker';
import { ProgressBarContainer } from '../../styled';

type WorkerPoolType = {
  [key: string]: { key: string; taskHelper?: TaskHelperInterface };
};

const TaskExecutor = () => {
  const dispatch = useAppDispatch();
  const [threadCounts, setThreadCounts] = useState(10);
  const [defaultTaskSets, setDefaultTaskSets] = useState({
    url: 'https://w.1717shua.cn/addons/zjl_mass_tpl_msg/apiAgent.php',
    // url: 'https://agent.1717shua.cn/cgi-bin/template/api_add_template',
    delay: 0,
    search: {
      api: 'message/template/send',
      access_token: 'test_token',
    },
    params: {
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
  const init = () => {
    if (!state) {
      console.log('threadCounts: ', threadCounts);

      const tasksObj: WorkerPoolType = {};
      new Array(threadCounts).fill('').forEach(() => {
        const key = Math.random().toString(32).substring(3);
        tasksObj[key] = { key };
      });
      setWorkerPool(tasksObj);
      setState(true);
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
  }, []);

  const isAllWorkerReady = useMemo(() => {
    const values = Object.values(workerPool);
    if (!values.length) return false;
    return values.every(({ taskHelper }) => {
      return !!taskHelper;
    });
  }, [workerPool]);

  return (
    <div>
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
      <div className={ProgressBarContainer}>
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
    </div>
  );
};

export default TaskExecutor;
