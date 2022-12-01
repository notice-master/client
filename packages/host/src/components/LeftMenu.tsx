import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Col, Layout, Row } from 'antd';
import React from 'react';

const RemoteLeftMenu = React.lazy(
  () => () => {
    return <></>
  }
);
const { Sider } = Layout;
const { ErrorBoundary } = Alert;

const LeftMenu = () => {
  const leftMenuCollapsed = localStorage.getItem('LEFT_MENU_COLLAPSED');

  return (
    <ErrorBoundary message="加载菜单失败" description="">
      <React.Suspense
        fallback={
          <Sider collapsible collapsed={leftMenuCollapsed === 'true'}>
            <Row
              align="middle"
              justify="space-around"
              style={{ height: '100%' }}
            >
              <Col>
                <LoadingOutlined
                  style={{ fontSize: 34, color: '#ffffff' }}
                  spin
                />
              </Col>
            </Row>
          </Sider>
        }
      >
        <RemoteLeftMenu />
      </React.Suspense>
    </ErrorBoundary>
  );
};
export default LeftMenu;
