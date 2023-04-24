import { CopyOutlined } from '@ant-design/icons';
import { copy } from '@nmc/common';
import { Space, Input, message, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

const LinkInput = () => {
  const { control } = useFormContext();
  const {
    field: { onChange, value, ref },
  } = useController({
    name: 'url',
    control,
  });
  const [linkPrefix, setLinkPrefix] = useState('https://');
  const [link, setLink] = useState('');
  const checkPrefixRegx = /^(?<linkPrefix>http[s]?:\/\/|tel:\/\/)/i;
  const handleLinkChange = (newLink = '') => {
    let newValue = newLink;
    const result = checkPrefixRegx.exec(newValue);
    if (result) {
      const { groups } = result;
      if (groups?.linkPrefix) {
        setLinkPrefix(groups?.linkPrefix?.toLowerCase());
        newValue = newValue.replace(checkPrefixRegx, '');
      }
    }
    setLink(newValue);
  };
  if (!link && value) {
    handleLinkChange(value);
  }
  const selectBefore = (
    <Select
      onChange={(newValue) => {
        setLinkPrefix(newValue);
      }}
      value={linkPrefix}
      defaultValue={linkPrefix}
      className="select-before"
    >
      <Select.Option value="https://">https://</Select.Option>
      <Select.Option value="http://">http://</Select.Option>
      <Select.Option value="tel://">tel://</Select.Option>
    </Select>
  );
  useEffect(() => {
    if (link) {
      onChange(`${linkPrefix}${link}`);
    } else {
      onChange('');
    }
  }, [linkPrefix, link]);
  return (
    <Space.Compact size="large" style={{ display: 'flex' }}>
      <Input
        ref={ref}
        onChange={(event) => {
          const {
            target: { value: newValue },
          } = event;
          handleLinkChange(newValue);
        }}
        value={link}
        addonBefore={selectBefore}
        addonAfter={
          <Tooltip title="复制链接">
            <CopyOutlined
              onClick={() => {
                copy(value);
                message.success('复制成功');
              }}
            />
          </Tooltip>
        }
      />
    </Space.Compact>
  );
};
export default LinkInput;
