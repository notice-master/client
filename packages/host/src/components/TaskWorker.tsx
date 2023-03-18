import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { AxiosRequestConfig } from 'axios';
import { Button, Col, Progress, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { MessageActions, WorkerStatus, WorkerUrl } from '../constants';
import { getMessage, getRemoteWorker } from '../utils';
import { ProcessHelper } from '../utils';

type TaskWorkerProps = {
  id?: string;
  index?: number;
  config: TTaskConfig;
  defaultRequestConfig: AxiosRequestConfig;
  onWorkerReady: (data: ProcessHelper, id: string) => void;
  onDestroy: (id: string) => void;
};

const TaskWorker: React.FunctionComponent<TaskWorkerProps> = (props) => {
  const { onWorkerReady, onDestroy, defaultRequestConfig, id, index, config } =
    props;
  const [state, setState] = useState<TTaskState>({
    status: WorkerStatus.pending,
    total: 0,
    finished: 0,
    pending: 0,
    successed: 0,
    failed: 0,
  });
  const [processHelper, setProcessHelper] = useState<ProcessHelper>();
  const [progress, setProgress] = useState({
    total: 0,
    finished: 0,
    percent: 0,
  });
  const handleMessage = (_message: TWorkerMessage, _worker: Worker) => {
    const { state } = _message;
    const { total = 0, finished = 0 } = state || {};
    if (state && processHelper) processHelper.state = state;
    switch (_message.action) {
      case MessageActions.ready:
        if (typeof onWorkerReady === 'function' && processHelper && id) {
          onWorkerReady(processHelper, id);
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
    if (processHelper) {
      setState(processHelper.state);
      console.log(
        '🚀 ~ file: TaskWorker.tsx:62 ~ handleMessage ~ processHelper.state:',
        processHelper.state
      );
    }
  };
  useEffect(() => {
    let tempWorker: Worker | null;
    try {
      tempWorker = new Worker(getRemoteWorker(WorkerUrl));
      setProcessHelper(new ProcessHelper(tempWorker, state));
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
    if (processHelper) {
      processHelper.worker.onmessage = (message) => {
        const { data: messageData } = message;
        handleMessage(messageData, processHelper.worker);
      };
      processHelper.worker.postMessage(
        getMessage(MessageActions.setup, {
          config,
          defaultRequestConfig,
        })
      );
    }
  }, [processHelper]);

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
              !processHelper ||
              state.status === WorkerStatus.uninitialized ||
              state.status === WorkerStatus.running
            }
            shape="circle"
            onClick={() => {
              if (processHelper) {
                processHelper.run();
              }
            }}
            icon={<CaretRightOutlined />}
          />
          <Button
            size="small"
            type="primary"
            disabled={
              !processHelper ||
              state.status === WorkerStatus.uninitialized ||
              state.status !== WorkerStatus.running
            }
            shape="circle"
            onClick={() => {
              if (processHelper) {
                processHelper.pause();
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
