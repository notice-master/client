import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { AxiosRequestConfig } from 'axios';
import { Button, Col, Progress, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { MessageActions, WorkerStatus, WorkerUrl } from '../constants';
import { getMessage, getRemoteWorker } from '../utils';
import { TTaskConfig } from 'src/types/worker';

type TaskWorkerProps = {
  id?: string;
  index?: number;
  taskConfig: TTaskConfig;
  defaultRequestConfig: AxiosRequestConfig;
  onWorkerReady: (data: TaskHelper, id: string) => void;
  onDestroy: (id: string) => void;
};
class TaskHelper implements TaskHelperInterface {
  public worker;
  public status: string;
  constructor(worker: Worker) {
    this.worker = worker;
    this.status = WorkerStatus.uninitialized;
  }
  // push(tasks: taskType[]) {
  //   this.worker.postMessage(
  //     getMessage(MessageActions.setup, {
  //       tasks: [...tasks],
  //     })
  //   );
  // }
  pause() {
    this.worker.postMessage(getMessage(MessageActions.pause));
  }
  run() {
    this.worker.postMessage(getMessage(MessageActions.run));
  }
  setUp(taskSets: taskSetsType) {
    this.worker.postMessage(getMessage(MessageActions.setup, taskSets));
  }
}
const TaskWorker: React.FunctionComponent<TaskWorkerProps> = (props) => {
  const {
    onWorkerReady,
    onDestroy,
    defaultRequestConfig,
    id,
    index,
    taskConfig,
  } = props;
  const [status, setStatus] = useState(WorkerStatus.uninitialized);
  const [workerHelper, setWorkerHelper] = useState<TaskHelper>();
  const [progress, setProgress] = useState({
    total: 0,
    finished: 0,
    percent: 0,
  });
  const handleMessage = (_message: any, _worker: Worker) => {
    const { status } = _message;
    const { total, finished } = status;
    switch (_message.action) {
      case MessageActions.ready:
        if (typeof onWorkerReady === 'function' && workerHelper && id) {
          onWorkerReady(workerHelper, id);
        }
        break;
      case MessageActions.response:
        break;
      case MessageActions.updated:
        if (total > 0 && finished > 0) {
          setProgress({
            total,
            finished,
            percent: Number(((finished / total) * 100).toFixed(2)),
          });
        }
        break;
      default:
        break;
    }
    if (workerHelper) {
      workerHelper.status = status?.name;
      setStatus(status?.name);
    }
  };
  useEffect(() => {
    let tempWorker: Worker | null;
    try {
      tempWorker = new Worker(getRemoteWorker(WorkerUrl));
      setWorkerHelper(new TaskHelper(tempWorker));
    } catch (error) {
      console.error('error: ', error);
      tempWorker = null;
    }

    return () => {
      if (typeof onDestroy === 'function' && id) {
        onDestroy(id);
      }
      if (tempWorker) {
        tempWorker.terminate();
      }
    };
  }, []);

  useEffect(() => {
    if (workerHelper) {
      workerHelper.worker.onmessage = (message) => {
        const { data: messageData } = message;
        handleMessage(messageData, workerHelper.worker);
      };
      workerHelper.worker.postMessage(
        getMessage(MessageActions.setup, {
          taskConfig,
          defaultRequestConfig,
        })
      );
    }
  }, [workerHelper]);

  return (
    <Row
      className="progress-bar"
      align="middle"
      gutter={16}
      style={{ padding: '5px 0' }}
    >
      <Col style={{ width: '30px', textAlign: 'right' }}>{index}</Col>
      <Col flex="auto" style={{ paddingRight: '2rem' }}>
        <Progress percent={progress.percent} />
      </Col>
      <Col>{`${progress.finished}/${progress.total}`}</Col>
      <Col>
        <Space>
          <Button
            size="small"
            type="primary"
            disabled={
              !workerHelper ||
              status === WorkerStatus.uninitialized ||
              status === WorkerStatus.running
            }
            shape="circle"
            onClick={() => {
              if (workerHelper) {
                workerHelper.run();
              }
            }}
            icon={<CaretRightOutlined />}
          />
          <Button
            size="small"
            type="primary"
            disabled={
              !workerHelper ||
              status === WorkerStatus.uninitialized ||
              status !== WorkerStatus.running
            }
            shape="circle"
            onClick={() => {
              if (workerHelper) {
                workerHelper.pause();
              }
            }}
            icon={<PauseOutlined />}
          />
        </Space>
      </Col>
    </Row>
  );
};

export default TaskWorker;
