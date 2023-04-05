import {
  EditOutlined,
  EllipsisOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { gql, useAppDispatch, useQuery } from '@nmc/common';
import { Button, Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplatePreview } from '../components';

const MaterialList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const materialService = useQuery(gql`
    query getMaterials($page: Int!, $type: String) {
      materials(page: $page, type: $type) {
        id
        template_id
        template_type
        title
        template_detail
        final_data
        create_time
        update_time
      }
    }
  `);
  console.log('templatesService: ', materialService);
  useEffect(() => {}, []);
  return (
    <Row gutter={[8, 8]}>
      {materialService?.data?.materials.map((material: any) => {
        return (
          <Col xs={24} md={12} lg={8} xl={6} key={material?.id}>
            <Card
              bodyStyle={{ padding: '0px' }}
              actions={[
                <Button key="send" type="text" block onClick={() => {}}>
                  <SendOutlined key="send" label="发送" />
                </Button>,
                <Button
                  key="edit"
                  type="text"
                  block
                  onClick={() => {
                    // history.push
                    navigate('/template-message/edit', {
                      replace: true,
                      state: { material },
                    });
                  }}
                >
                  <EditOutlined />
                </Button>,
                <Button key="ellipsis" type="text" block onClick={() => {}}>
                  <EllipsisOutlined />
                </Button>,
              ]}
            >
              <TemplatePreview
                style={{ height: '300px' }}
                template={JSON.parse(material?.template_detail)}
                data={JSON.parse(decodeURIComponent(material?.final_data))}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default MaterialList;
