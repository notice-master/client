import { EditOutlined } from '@ant-design/icons';
import { Divider, Typography } from 'antd';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import TemplateField from './TemplateField';

type TemplateFieldGroupType = {
  content: string | undefined;
};

const { Link } = Typography;

const TemplateFieldGroup: React.ForwardRefRenderFunction<
  TemplateFieldGroupHandles | undefined,
  TemplateFieldGroupType
> = (props: TemplateFieldGroupType, ref) => {
  const { content = '' } = props;
  const [focusedInputName, setFocusedInputName] = useState('');
  const regExp = /(\w+)(?=\.DATA)/gi;
  const fields = content.match(regExp);
  const focusedInputRef = useRef<TextAreaRef>();
  const { setValue, getValues } = useFormContext();

  useImperativeHandle(ref, () => ({
    insertTag: (tag) => {
      focusedInputRef?.current?.focus();
      if (focusedInputRef?.current) {
        const value = getValues(focusedInputName);
        const { current: InputObj } = focusedInputRef;
        const { resizableTextArea: { textArea: input } = {} } = InputObj;
        if (input) {
          const start = input.selectionStart || 0;
          const end = input.selectionEnd || 0;
          setValue(focusedInputName, {
            ...value,
            value:
              input.value.substring(0, start) +
              tag +
              input.value.substring(end, input.value.length),
          });
          // TODO: Set the cursor position to the end of the last inserted tag
          // const newCursorPosition = start + tag.length;
          // input.selectionStart = ;
          // input.selectionEnd = input.selectionStart;
          // input.setSelectionRange(newCursorPosition, newCursorPosition);
          input.focus();
        }
      }
    },
  }));
  if (fields?.length) {
    return (
      <>
        <Divider orientation="left">
          <EditOutlined />
          模板标签设置:
          <Link
            href="https://developers.weixin.qq.com/community/develop/doc/000a2ae286cdc0f41a8face4c51801?blockType=1"
            target="_blank"
          >
            《关于规范公众号模板消息的再次公告》
          </Link>
        </Divider>

        {fields
          // delete first and remark tags
          ?.filter(
            (field) =>
              field.toLowerCase() !== 'first' &&
              field.toLowerCase() !== 'remark'
          )
          ?.map((field) => {
            if (`data.${field}` === focusedInputName) {
              return (
                <TemplateField
                  key={field}
                  name={field}
                  ref={focusedInputRef}
                  onFucus={(name) => {
                    setFocusedInputName(name);
                  }}
                />
              );
            }
            return (
              <TemplateField
                key={field}
                name={field}
                onFucus={(name) => {
                  setFocusedInputName(name);
                }}
              />
            );
          })}
      </>
    );
  }
  return <></>;
};
const ForwardTemplateFieldGroup = forwardRef(TemplateFieldGroup);
ForwardTemplateFieldGroup.displayName = 'TemplateFieldGroup';
export default ForwardTemplateFieldGroup;
