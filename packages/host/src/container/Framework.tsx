import { useNLS } from '@nmc/common';
import { Alert, Layout } from 'antd';
// import 'antd/dist/antd.min.css';
import { LeftMenu, EditTaskModal } from '../components';
import MainContent from '../container/MainContent';
import { useSubmit } from 'react-router-dom';

const { Footer } = Layout;

const Framework = () => {
  const { intl } = useNLS('global');
  const { ErrorBoundary } = Alert;
  const submit = useSubmit();

  return (
    <Layout style={{ minHeight: '100vh' }} hasSider={true}>
      <ErrorBoundary>
        <LeftMenu />
        <Layout className="site-layout">
          <MainContent />
          <Footer style={{ textAlign: 'center' }}>
            Notice Master ©2023 Created by{' '}
            <a target="_blank" href="https://www.zjl.me" rel="noreferrer">
              ZJL.ME
            </a>
          </Footer>
        </Layout>
      </ErrorBoundary>
      <EditTaskModal
        onConfirm={(taskId: string) => {
          const formData = new FormData();
          formData.append('taskId', taskId);
          submit(formData, { action: '/task/executor', method: 'post' });
        }}
      />
    </Layout>
  );
};

export default Framework;
