import { globalMessages, useNLS } from '@nmc/common';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';

const BreadcrumbContent = () => {
  const { pathname } = useLocation();
  const { intl } = useNLS();

  return (
    <Breadcrumb
      style={{ margin: '16px 0' }}
      items={pathname
        .split('/')
        .filter((item) => item)
        .map((item: string) => ({
          title: globalMessages[item]
            ? intl.formatMessage(globalMessages[item])
            : item,
        }))}
    ></Breadcrumb>
  );
};

export default BreadcrumbContent;
