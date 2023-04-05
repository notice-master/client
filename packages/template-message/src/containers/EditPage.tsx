import {
  EditOutlined,
  MobileOutlined,
  RollbackOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { gql, useAppDispatch, useInjectReducer, useQuery } from '@nmc/common';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  Controller,
  FieldError,
  FormProvider,
  useForm,
  useWatch,
} from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import * as yup from 'yup';
import {
  DynamicTagsPanel,
  LinkInput,
  TemplateFieldGroup,
  TemplatePreview,
} from '../components';
import reducer from '../redux/slice';

type teamplateType = {
  template_id: string;
  title: string;
  primary_industry: string;
  deputy_industry: string;
  content: string;
  example: string;
};
type teamplatesObjectType = {
  [key: string]: teamplateType;
};
const schema = yup
  .object({
    ['template_id']: yup.string().required('请选择一个模板'),
  })
  .required();
const EditPage = () => {
  const dispatch = useAppDispatch();
  const [currentTemplate, setCurrentTemplate] = useState<teamplateType | null>(
    null
  );
  const { state = {} } = useLocation();

  useInjectReducer({ key: 'template-message', reducer });
  const methods = useForm<templateDataType>({
    resolver: yupResolver(schema),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getFieldState,
    getValues,
    reset,
  } = methods;
  const [form] = Form.useForm();

  const fieldDatas: templateDataType = useWatch({
    control,
    defaultValue: {
      touser: '',
      template_id: '',
      url: '',
      miniprogram: {
        appid: '',
        pagepath: '',
      },
      data: {},
    },
  });
  const templateFieldGroupRef = useRef<TemplateFieldGroupHandles>();
  useEffect(() => {
    let defaultValues = {};
    if (state) {
      const { material } = state;
      if (material) {
        const { final_data, template_detail } = material;
        const templateDetail = JSON.parse(decodeURIComponent(template_detail));
        try {
          setCurrentTemplate(templateDetail);
          defaultValues = JSON.parse(decodeURIComponent(final_data));
          reset(defaultValues);
        } catch (e) {
          console.error('e: ', e);
        }
      }
    }
  }, []);
  useEffect(() => {
    const errorArray = Object.values(errors);
    if (errorArray.length) {
      const [firstError] = errorArray as FieldError[];
      firstError?.ref?.focus?.();
      message.error(firstError?.message);
    }
  }, [errors]);

  const templatesService = useQuery(gql`
    query getTemplates($refresh: Boolean!) {
      templates(refresh: $refresh) {
        template_id
        title
        primary_industry
        deputy_industry
        content
        example
      }
    }
  `);
  const teamplatesObject: teamplatesObjectType = {};
  if (templatesService?.data) {
    const {
      data: { templates },
    } = templatesService;
    if (templates.length) {
      templates.reduce((obj: teamplatesObjectType, cur: teamplateType) => {
        obj[cur.template_id] = cur;
        return obj;
      }, teamplatesObject);
    }
  }

  const onSubmit = (values: any) => {
    console.log('values: ', values);
    console.log('errors: ', errors);
  };
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={12}>
          <FormProvider {...methods}>
            <Form
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              layout="horizontal"
              size="large"
              onFinish={handleSubmit(onSubmit)}
              onFinishFailed={({ values }) => {
                const callback = handleSubmit(onSubmit);
                callback(values);
              }}
            >
              <Card
                title={
                  <Row justify="space-between">
                    <Col>模板设置</Col>
                    <Col>
                      <Form.Item style={{ margin: 0 }}>
                        <Controller
                          name="remark_title"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              prefix={
                                <>
                                  <EditOutlined size={12} />
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      color: '#979393',
                                    }}
                                  >
                                    素材标题:
                                  </span>
                                </>
                              }
                              size="small"
                              bordered={false}
                              style={{
                                width: 200,
                                borderBottom: 'solid 1px #d9d9d9',
                              }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                }
              >
                <Form.Item label="选择模板">
                  <Input.Group compact style={{ display: 'flex' }}>
                    <Controller
                      name="template_id"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Select
                          ref={field.ref}
                          status={fieldState?.invalid ? 'error' : ''}
                          value={field.value}
                          style={{ flexGrow: '1' }}
                          placeholder="请选择一个模板"
                          onChange={(val) => {
                            field.onChange(val);
                            const { isDirty } = getFieldState('remark_title');
                            if (!isDirty) {
                              setValue(
                                'remark_title',
                                teamplatesObject[val]?.title || '',
                                {
                                  shouldDirty: false,
                                }
                              );
                            }
                            setCurrentTemplate(teamplatesObject[val]);
                          }}
                        >
                          {Object.values(teamplatesObject).map(
                            (item: teamplateType) => (
                              <Select.Option
                                key={item.template_id}
                                value={item.template_id}
                              >
                                {item.title}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      )}
                    />
                    <Button type="primary">更新列表</Button>
                  </Input.Group>
                </Form.Item>
                <Form.Item label="消息链接">
                  <LinkInput />
                </Form.Item>
                <Form.Item label="APP ID">
                  <Controller
                    name="miniprogram.appid"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <Input {...field} />}
                  />
                </Form.Item>
                <Form.Item label="Page path">
                  <Controller
                    name="miniprogram.pagepath"
                    defaultValue=""
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </Form.Item>
                <TemplateFieldGroup
                  ref={templateFieldGroupRef}
                  content={currentTemplate?.content}
                />
              </Card>
            </Form>
          </FormProvider>
        </Col>
        <Col span={5}>
          <Card title="操作">
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  block
                  onClick={() => {
                    form.submit();
                  }}
                >
                  保存素材
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  icon={<MobileOutlined />}
                  block
                  style={{ backgroundColor: '#26a69a', borderColor: 'unset' }}
                >
                  预览
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  icon={<RollbackOutlined />}
                  block
                  style={{ backgroundColor: '#21b945', borderColor: 'unset' }}
                >
                  返回
                </Button>
              </Col>
            </Row>
          </Card>
          <Divider style={{ margin: '5px 0' }} />
          <DynamicTagsPanel
            onTagClick={(item) => {
              const { tag } = item;
              console.log('tag: ', tag);
              if (!templateFieldGroupRef?.current) return;
              const {
                current: { insertTag },
              } = templateFieldGroupRef;
              if (!insertTag) return;
              insertTag(tag);
            }}
          />
        </Col>
        <Col span={7}>
          <Card title="预览">
            <TemplatePreview
              template={currentTemplate}
              data={fieldDatas}
              bordered
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditPage;
