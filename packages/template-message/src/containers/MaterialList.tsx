import {
  EditOutlined,
  EllipsisOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  gql,
  useAppDispatch,
  useSelector,
  setModalConfig,
  useManageDBInstance,
} from '@nmc/common';
import type { GlobalState } from '@nmc/common';
import { Pagination, Card, Col, Row } from 'antd';
import type { PaginationProps } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as R from 'ramda';
import { TemplatePreview } from '../components';
import { WECHAT_API_HOST } from '../constats';

const MaterialList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appId = '' } = useSelector<{ global: GlobalState }, GlobalState>(
    (state) => state?.global || {}
  );
  const [materilas, setMaterilas] = useState<IMaterialTemplateMessageDetail[]>(
    []
  );
  const { db: taskManageDB } = useManageDBInstance(appId);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    total: 0,
    current: 1,
    pageSize: 8,
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
      const tx = taskManageDB.transaction('materials', 'readonly');
      const { current = 1, pageSize = 10 } = pagination;
      tx.store.count().then((total) => {
        setPagination({ ...pagination, total });
      });
      getDataByPage(current, pageSize).then((data) => {
        setMaterilas(data);
      });
    }
  };
  useEffect(() => {
    refreshCurrentPage();
  }, [taskManageDB, pagination.current, pagination.pageSize]);

  useEffect(() => {}, []);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize,
    });
  };

  return (
    <div>
      <Row gutter={[8, 8]}>
        {materilas.map((material) => {
          const { requestData, id, templateData } = material;
          return (
            <Col xs={24} md={12} lg={8} xl={6} key={id}>
              <Card
                bodyStyle={{ padding: '0px' }}
                actions={[
                  <SendOutlined
                    key="send"
                    label="发送"
                    onClick={() => {
                      dispatch(
                        setModalConfig({
                          open: true,
                          defaultRequestConfig: {
                            url: `${WECHAT_API_HOST.replace(
                              /\/$/,
                              ''
                            )}/cgi-bin/message/template/send`,
                            params: {
                              access_token: 'test_token',
                            },
                            data: R.clone(requestData),
                            method: 'POST',
                            headers: {
                              'Content-Type':
                                'application/x-www-form-urlencoded',
                            },
                          },
                        })
                      );
                    }}
                  />,
                  <EditOutlined
                    onClick={() => {
                      // history.push
                      navigate('../edit', {
                        replace: true,
                        state: { material: R.clone(material) },
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
        <Col xs={24} md={24}>
          <Pagination
            style={{ float: 'right' }}
            showSizeChanger
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePaginationChange}
            pageSizeOptions={[8, 12, 20, 40, 80, 100]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MaterialList;
