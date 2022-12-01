import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Col, Layout, Row } from 'antd';
import React from 'react';
import { CommonHeader } from '../components';

const { ErrorBoundary } = Alert;

const ContentWrapper = ({ children }) => {
  return (
    <>
      <CommonHeader />
      <Layout.Content style={{ margin: '0 16px' }}>{children}</Layout.Content>
    </>
  );
};

const MainContent = () => {
  // const {MainRouters} = React.lazy(() => import('@nmc/navigation/container'));
  const MainRouters = React.lazy(() =>
    () => <></>
    // import('@nmc/navigation/container').then((modules) => {
    //   const { MainRouters } = modules;
    //   return {
    //     default: MainRouters,
    //   };
    // })
  );

  return (
    <ErrorBoundary message="加载路由失败" description="">
      <React.Suspense
        fallback={
          <Row align="middle" justify="space-around">
            <Col>
              <LoadingOutlined style={{ fontSize: 46 }} spin />
            </Col>
          </Row>
        }
      >
        <MainRouters wrapper={ContentWrapper} />
      </React.Suspense>
    </ErrorBoundary>
  );
};
export default MainContent;
