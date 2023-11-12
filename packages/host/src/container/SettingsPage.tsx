import { Card, Space, Progress } from 'antd';
import { useAppDispatch } from '@nmc/common';
import { useEffect, useMemo, useState } from 'react';

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate>({
    usage: 0,
    quota: 1,
  });

  return (
    <Space direction="vertical" size={16}>
      test
    </Space>
  );
};

export default SettingsPage;
