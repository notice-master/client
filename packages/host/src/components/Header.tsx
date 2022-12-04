import { PageHeader } from '@ant-design/pro-components';
import { useAppSelector } from '@nmc/common';
import { Layout } from 'antd';

const CommonHeader = () => {
  const { Header } = Layout;
  const currentPageInfo = useAppSelector(
    (state) => state.global.currentPageInfo
  );

  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {
        (currentPageInfo?.title || currentPageInfo?.subtitle) && (
          <PageHeader
            className="site-page-header"
            title={currentPageInfo.title}
            subTitle={currentPageInfo.subtitle}
          />
        )
      }
      
    </Header>
  );
};
export default CommonHeader;
