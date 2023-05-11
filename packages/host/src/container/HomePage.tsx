import { Card, Space, Progress } from 'antd';
import { useAppDispatch } from '@nmc/common';
import { useEffect, useMemo, useState } from 'react';

const filterSize = (size: number) => {
  if (!size) return '';
  if (size < pow1024(1)) return size + ' B';
  if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB';
  if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB';
  if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB';
  return (size / pow1024(4)).toFixed(2) + ' TB';
};
function pow1024(num: number) {
  return Math.pow(1024, num);
}

const HomePage = () => {
  const dispatch = useAppDispatch();
  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate>({
    usage: 0,
    quota: 1,
  });
  const storageUsagePercent = useMemo(
    () =>
      Number(
        ((storageEstimate.usage || 0) / (storageEstimate.quota || 1)).toFixed(2)
      ),
    [storageEstimate]
  );
  useEffect(() => {
    navigator.storage
      .estimate()
      .then(function (estimate) {
        estimate && setStorageEstimate(estimate);
      })
      .catch(function (error) {
        console.error('Error getting storage estimate: ', error);
      });
  }, []);

  return (
    <Space direction="vertical" size={16}>
      <Card title="数据磁盘占用">
        <Progress
          type="circle"
          percent={storageUsagePercent}
          format={(percent) => percent?.toFixed(2) + '%'}
        />
        <p>已使用：{filterSize(Number(storageEstimate.usage))}</p>
        <p>总容量：{filterSize(Number(storageEstimate.quota))}</p>
      </Card>
    </Space>
  );
};

export default HomePage;
