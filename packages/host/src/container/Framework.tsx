import { useNLS } from '@nmc/common';
import { Alert, Layout } from 'antd';
// import 'antd/dist/antd.min.css';
import { LeftMenu } from '../components';
import MainContent from '../container/MainContent';
import '../styled/common.scss';

const { Footer } = Layout;

const Framework = () => {
  const { intl } = useNLS('global');
  const { ErrorBoundary } = Alert;
  return (
    <Layout style={{ minHeight: '100vh' }} hasSider={true}>
      <ErrorBoundary>
        <LeftMenu />
        <Layout className="site-layout">
          <MainContent />
          <Footer style={{ textAlign: 'center' }}>
            Notice Master ©2022 Created by{' '}
            <a target="_blank" href="https://www.zjl.me" rel="noreferrer">
              ZJL.ME
            </a>
          </Footer>
        </Layout>
      </ErrorBoundary>
    </Layout>
  );
};

export default Framework;
