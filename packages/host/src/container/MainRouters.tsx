import { LoadingOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@nmc/common';
import { Alert, Col, Layout, Row } from 'antd';
import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import BreadcrumbContent from '../components/BreadcrumbContent';
import { routes } from '../routes';
import NotFoundPage from './NotFoundPage';
interface MainRoutersProps {
  wrapper?: React.FunctionComponent;
}
const DefaultWrapper = ({ children }: { children: React.ReactNode }) => (
  <Layout.Content style={{ margin: '0 16px' }}>{children}</Layout.Content>
);

const MainRouters = ({ wrapper }: MainRoutersProps) => {
  const Wrapper = wrapper || DefaultWrapper;
  const dispatch = useAppDispatch();
  let location = useLocation();
  useEffect(() => {
    return () => {};
  }, [location]);
  const { ErrorBoundary } = Alert;
  return (
    <Routes>
      {routes.map((item) => {
        const TempComponent = () => (
          <Wrapper>
            <BreadcrumbContent />
            <React.Suspense
              fallback={
                <Row align="middle" justify="space-around">
                  <Col>
                    <LoadingOutlined style={{ fontSize: 46 }} spin />
                  </Col>
                </Row>
              }
            >
              <ErrorBoundary message={'加载内容失败'} description="">
                {item.component}
              </ErrorBoundary>
            </React.Suspense>
          </Wrapper>
        );
        return (
          <Route key={item.path} path={item.path} element={<TempComponent />} />
        );
      })}
      <Route path="/" element={<Navigate replace to="home" />} />
      <Route
        path="*"
        element={
          <DefaultWrapper>
            <NotFoundPage />
          </DefaultWrapper>
        }
      />
    </Routes>
  );
};
export default MainRouters;
