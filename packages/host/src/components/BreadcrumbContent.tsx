import { globalMessages, useNLS } from '@nmc/common';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';

const BreadcrumbContent = () => {
  const { pathname } = useLocation();
  const { intl } = useNLS();

  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      {pathname
        .split('/')
        .filter((item) => item)
        .map((item: string) => (
          <Breadcrumb.Item key={item}>
            {globalMessages[item]
              ? intl.formatMessage(globalMessages[item])
              : item}
          </Breadcrumb.Item>
        ))}
    </Breadcrumb>
  );
};

export default BreadcrumbContent;
