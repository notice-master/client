import { RightOutlined } from '@ant-design/icons';
import { Button, Divider, Row, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import {
  TemplatePreviewBox,
  TemplatePreviewContent,
  withBorder,
} from './style/TemplatePreviewBox.css';

type TemplatePreviewProps = {
  data: templateDataType;
  template: {
    content: string;
    title: string;
  } | null;
  style?: React.CSSProperties;
  bordered?: boolean;
};
type DetailLinkProps = {
  url?: string;
  appid?: string;
  pagepath?: string;
};
const TemplatePreview = (props: TemplatePreviewProps) => {
  const { template, data, style, bordered } = props;
  const boxClasses = bordered
    ? `${TemplatePreviewBox} ${withBorder}`
    : `${TemplatePreviewBox}`;
  const { Text } = Typography;
  let html = '';
  if (template?.content) {
    html = template.content;
  }
  const {
    data: fieldData,
    url = '',
    miniprogram: { appid, pagepath } = {},
  } = data;
  if (fieldData) {
    Object.entries(fieldData).forEach(
      ([key, value]: [string, templateFieldValueType]) => {
        if (value?.value) {
          html = html.replace(
            `{{${key}.DATA}}`,
            `<span style="color:${value?.color || '#000000'};">${
              value?.value || ''
            }</span>`
          );
        } else {
          html = html.replace(
            `{{${key}.DATA}}`,
            `<span style="color:${
              value?.color || '#000000'
            };">{{${key}.DATA}}</span>`
          );
        }
      }
    );
  }
  html = html.replace(/\n/g, '<br/>'); //IE9、FF、chrome
  html = html.replace(/\r/g, '<br/>'); //IE7-8
  const DetailLink = ({ url, appid, pagepath }: DetailLinkProps) => {
    const showDetailLink = !!(url || appid || pagepath);
    let tooltipTitle = '';
    if (url) {
      tooltipTitle = `打开链接: ${url}`;
    } else {
      tooltipTitle = `打开小程序`;
    }
    return showDetailLink ? (
      <>
        <Divider style={{ margin: '10px 0px' }} />
        <Tooltip title={tooltipTitle} placement="topLeft">
          <Button
            type="link"
            block
            size="small"
            onClick={() => {
              if (url) {
                window.open(url);
              }
            }}
            style={{ padding: '0px', color: '#000000' }}
          >
            <Row justify="space-between">
              查看详情
              <RightOutlined />
            </Row>
          </Button>
        </Tooltip>
      </>
    ) : (
      <></>
    );
  };

  return (
    <div style={style} className={boxClasses}>
      {template?.content ? (
        <>
          <Text style={{ fontSize: '1rem' }}>{template?.title}</Text>
          <Text type="secondary">{dayjs().format('MM月DD日')}</Text>
          <div
            className={TemplatePreviewContent}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <DetailLink {...{ url, appid, pagepath }} />
        </>
      ) : (
        '模板内容有误'
      )}
    </div>
  );
};
export default TemplatePreview;
