import { useNLS } from '@nmc/common';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';

const BreadcrumbContent = () => {
  const { pathname } = useLocation();
  const { nls } = useNLS('global');

  return (
    <Breadcrumb
      style={{ margin: '16px 0' }}
      items={pathname
        .split('/')
        .filter((item) => item)
        .map((item: string) => ({
          title: nls(item),
        }))}
    ></Breadcrumb>
  );
};

export default BreadcrumbContent;
