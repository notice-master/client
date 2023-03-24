import { PageHeader } from '@ant-design/pro-components';
import { Layout } from 'antd';

const CommonHeader = ({ title = '', subTitle = '' }) => {
  const { Header } = Layout;
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {(title || subTitle) && (
        <PageHeader
          className="site-page-header"
          title={title}
          subTitle={subTitle}
        />
      )}
    </Header>
  );
};
export default CommonHeader;
