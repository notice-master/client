import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { getMessage, getRemoteWorker, MessageActions, WorkerStatus } from '@nmc/common';
import { Button, Col, Progress, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { WorkerUrl } from '../constants';

type TaskWorkerProps = {
  id?: string;
  index?: number;
  defaultTaskSets: taskSetsType;
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
  push(tasks: taskType[]) {
    this.worker.postMessage(
      getMessage(MessageActions.setup, {
        tasks: [...tasks],
      })
    );
  }
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
  const { onWorkerReady, onDestroy, defaultTaskSets, id, index } = props;
  const [status, setStatus] = useState(WorkerStatus.uninitialized);
  const [workerHelper, setWorkerHelper] = useState<TaskHelper>();
  const [progress, setProgress] = useState(0);
  const handleMessage = (_message: any, _worker: Worker) => {
    const { status } = _message;
    const { total, finished } = status;
    switch (_message.action) {
      case MessageActions.ready:
        if (typeof onWorkerReady === 'function' && workerHelper && id) {
          onWorkerReady(workerHelper, id);
        }
        break;
      case MessageActions.convey:
        if (total > 0 && finished > 0) {
          setProgress(Number(((finished / total) * 100).toFixed(2)));
        }
        break;
      case MessageActions.response:
        break;
      case MessageActions.updated:
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
        getMessage(MessageActions.setup, defaultTaskSets)
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
      <Col flex="auto">
        <Progress percent={progress} />
      </Col>
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
