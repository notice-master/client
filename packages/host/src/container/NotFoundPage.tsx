import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="对不起，未找到您访问的页面"
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate('/');
          }}
        >
          返回首页
        </Button>
      }
    />
  );
};
export default NotFoundPage;
