import {
  EditOutlined,
  EllipsisOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { getTaskManageDBInstance } from '@nmc/idb';
import { gql, useAppDispatch, useQuery } from '@nmc/common';
import type { IDBPDatabase } from '@nmc/idb';
import { Button, Card, Col, Row } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplatePreview } from '../components';

const MaterialList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [materilas, setMaterilas] = useState<IMaterialTemplateMessageDetail[]>(
    []
  );
  const [taskManageDB, setTaskManageDB] = useState<IDBPDatabase>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const getDataByPage = async (pageNum: number, pageSize: number) => {
    const result = [];
    if (taskManageDB) {
      const tx = taskManageDB.transaction('materials', 'readonly');
      let cursor = await tx.store.index('updateTime').openCursor(null, 'prev');
      let count = 1;
      while (cursor && result.length < pageSize) {
        if (count > (pageNum - 1) * pageSize && count <= pageNum * pageSize) {
          result.push({ ...cursor.value, key: cursor.value.id });
        }
        if (result.length >= pageSize) break;
        count++;
        cursor = await cursor.continue();
      }
    }
    return result;
  };
  const refreshCurrentPage = () => {
    if (taskManageDB) {
      const tx = taskManageDB.transaction('tasks', 'readonly');
      const { current = 1, pageSize = 10 } = pagination;
      tx.store.count().then((total) => {
        setPagination({ ...pagination, total });
      });
      getDataByPage(current, pageSize).then((data) => {
        console.log(
          '🚀 ~ file: MaterialList.tsx:50 ~ getDataByPage ~ data:',
          data
        );
        setMaterilas(data);
      });
    }
  };
  useEffect(() => {
    refreshCurrentPage();
  }, [taskManageDB, pagination.current, pagination.pageSize]);

  const initDB = async () => {
    setTaskManageDB(await getTaskManageDBInstance());
  };
  useEffect(() => {
    initDB();
  }, []);
  return (
    <Row gutter={[8, 8]}>
      {materilas.map((material) => {
        const { requestData, id, templateData } = material;
        return (
          <Col xs={24} md={12} lg={8} xl={6} key={id}>
            <Card
              bodyStyle={{ padding: '0px' }}
              actions={[
                <SendOutlined key="send" label="发送" />,
                <EditOutlined
                  onClick={() => {
                    // history.push
                    navigate('/template-message/edit', {
                      replace: true,
                      state: { material },
                    });
                  }}
                />,
                <EllipsisOutlined onClick={() => {}} />,
              ]}
            >
              <TemplatePreview
                style={{ height: '300px' }}
                template={templateData}
                data={requestData}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default MaterialList;
