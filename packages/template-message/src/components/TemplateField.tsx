import { FontColorsOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popover, Tooltip, Space } from 'antd';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { SketchPicker } from 'react-color';
import { Controller, useFormContext } from 'react-hook-form';
import { exampleStyle } from './style/TemplateField.css';

const presetColorsCacheKey = 'PRESET_COLORS';
let presetColors: string[] = [];
try {
  const cacheColors = localStorage.getItem(presetColorsCacheKey);
  if (cacheColors) {
    presetColors = JSON.parse(`${cacheColors}`);
  } else {
    throw new Error();
  }
} catch (e) {
  presetColors = [
    '#D0021B',
    '#F5A623',
    '#F8E71C',
    '#8B572A',
    '#7ED321',
    '#417505',
    '#BD10E0',
    '#9013FE',
    '#4A90E2',
    '#50E3C2',
    '#B8E986',
    '#000000',
    '#4A4A4A',
    '#9B9B9B',
    '#FFFFFF',
  ];
  localStorage.setItem(presetColorsCacheKey, JSON.stringify(presetColors));
}

const enum fieldTypes {
  'normal' = 'normal',
  'subscribe' = 'subscribe',
}
const TemplateField: React.ForwardRefRenderFunction<
  TextAreaRef | undefined,
  TemplateFieldType
> = (props, ref) => {
  // TODO: using useImperativeHandle to improve this component
  const { type = fieldTypes.normal, name, onFucus = () => {} } = props;
  const {
    control,
    handleSubmit,
    unregister,
    formState: { errors },
  } = useFormContext();
  const [textColor, setTextColor] = useState('#000000');
  const inputRef = React.useRef<TextAreaRef>(null);
  useImperativeHandle(ref, () => {
    if (inputRef?.current) {
      return inputRef.current;
    }
  });
  useEffect(() => {
    return () => {
      unregister(`data.${name}`);
    };
  }, []);
  return (
    <Form.Item label={name}>
      <Space.Compact size="large" style={{ display: 'flex' }}>
        <Controller
          name={`data.${name}`}
          control={control}
          defaultValue={{
            value: '',
            color: textColor,
          }}
          render={({ field: { value, onChange, name } }) => (
            <>
              <Input.TextArea
                autoSize
                onChange={({ target }) => {
                  onChange({ ...value, value: target?.value });
                }}
                value={value?.value || ''}
                ref={inputRef}
                onFocus={() => {
                  onFucus(name);
                }}
                style={{ color: textColor }}
              />
              {/* <Tooltip title="选取颜色">
                <Popover
                  placement="leftTop"
                  overlayClassName={exampleStyle}
                  content={
                    <SketchPicker
                      presetColors={presetColors}
                      color={textColor}
                      onChange={({ hex }: { hex: any }) => {
                        setTextColor(hex);
                        onChange({ ...value, color: hex });
                      }}
                    />
                  }
                  trigger="click"
                >
                  <Button
                    icon={<FontColorsOutlined style={{ color: textColor }} />}
                  />
                </Popover>
              </Tooltip> */}
            </>
          )}
        />
      </Space.Compact>
    </Form.Item>
  );
};
// TemplateField.displayName = 'TemplateField';
const ForwardTemplateField = forwardRef(TemplateField);
ForwardTemplateField.displayName = 'TemplateField';
// export default React.forwardRef(TemplateField);
export default ForwardTemplateField;
