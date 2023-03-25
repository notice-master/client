import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Col, Layout, Row } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainRouters from './MainRouters';
import { BreadcrumbContent } from '../components';

const { ErrorBoundary } = Alert;

interface Props {
  children?: React.ReactNode;
  // any props that come into the component
}

const MainContent = () => {
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
        <Layout.Content style={{ margin: '0 16px' }}>
          <BreadcrumbContent />
          <Outlet />
        </Layout.Content>
      </React.Suspense>
    </ErrorBoundary>
  );
};
export default MainContent;
