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
  // TODO: get templates from API
  const templates = [
    {
      template_id: 'YzVxNgy4GyX4bZzQo6oD-Q4wdB0nErOFhSe2jE7IrR0',
      title: '订阅模板消息',
      primary_industry: '',
      deputy_industry: '',
      content: '{{content.DATA}}',
      example: '',
      __typename: 'Template',
    },
    {
      template_id: 'f1DPMaEr-Q8WRYxmgxG67YCD8zoOOuyJCpel1OJEax0',
      title: '验证码通知',
      primary_industry: 'IT科技',
      deputy_industry: 'IT软件与服务',
      content:
        '{{first.DATA}}\n您当前的验证码是：{{keyword1.DATA}}\n有效期：{{keyword2.DATA}}\n{{remark.DATA}}',
      example:
        '您好，lisa@chinaemail.cn\r\n您当前的验证码是：456124\r\n有效期：30分钟内有效\r\n若非本人操作，可能您的帐号存在安全风险，请及时修改密码。',
      __typename: 'Template',
    },
    {
      template_id: '4NRyAO1ThzFLhTr9a9AYGHBfj57naSiAd-03sjz5lW0',
      title: '帐户资金变动提醒',
      primary_industry: 'IT科技',
      deputy_industry: 'IT软件与服务',
      content:
        '{{first.DATA}}\n\n变动时间：{{date.DATA}}\n变动金额：{{adCharge.DATA}}\n{{type.DATA}}帐户余额：{{cashBalance.DATA}}\n{{remark.DATA}}',
      example:
        '您好，您于2013/10/29  15:24 有一笔现金帐户充值到账：\n\n变动时间：2013/11/26 14：00\n变动金额：￥5618.63\n现金帐户余额：￥8454.74\n点击“查看详情“立即查阅您的帐户财务记录。',
      __typename: 'Template',
    },
    {
      template_id: '3Yt-lPJ-OWPQgjE4RKNeYmg-cchLh9_e3Eq-Q5hEg8U',
      title: '审核结果通知',
      primary_industry: 'IT科技',
      deputy_industry: 'IT软件与服务',
      content:
        '{{first.DATA}}\n审核人：{{keyword1.DATA}}\n审核内容：{{keyword2.DATA}}\n审核日期：{{keyword3.DATA}}\n{{remark.DATA}}',
      example:
        '您的申请已通过审核！\r\n审核人：测试\r\n审核内容：产假30天\r\n审核日期：2019年7月19日\r\n点击查看详情',
      __typename: 'Template',
    },
    {
      template_id: 'FMztTc7fw0k5wtLvHM6FljdIGIf0xOaZsRZYnqOX_84',
      title: '项目进度提醒',
      primary_industry: 'IT科技',
      deputy_industry: 'IT软件与服务',
      content:
        '{{first.DATA}}\n项目名称：{{keyword1.DATA}}\n当前状态：{{keyword2.DATA}}\n进度内容：{{keyword3.DATA}}\n更新时间：{{keyword4.DATA}}\n{{remark.DATA}}',
      example:
        '微信项目进度实时提醒\r\n项目名称：蓝点网络\r\n当前状态：开发中\r\n进度内容：项目正处于程序开介段\r\n更新时间：10月23日 10：00\r\n请您注意跟进。谢谢！',
      __typename: 'Template',
    },
    {
      template_id: 'E6rdo5ID7qwVsvYJnj54sSU0PRmojKhTzCiEKjUo3V4',
      title: '计划进展提醒',
      primary_industry: 'IT科技',
      deputy_industry: 'IT软件与服务',
      content:
        '{{first.DATA}}\n计划名称：{{keyword1.DATA}}\n计划类型：{{keyword2.DATA}}\n负责人：{{keyword3.DATA}}\n计划状态：{{keyword4.DATA}}\n完成度：{{keyword5.DATA}}\n{{remark.DATA}}',
      example:
        '您收到了新的工作计划\r\n计划名称：工作计划\r\n计划类型：2017-10-31 15:30:20\r\n负责人：iFeng\r\n计划状态：进行中\r\n完成度：20%\r\n如有问题请联系管理员。',
      __typename: 'Template',
    },
    {
      template_id: 'E81qUyxxBHDETxucoSqTriykHAjDrb2gZsEE_59ZA4c',
      title: '工作完成提醒',
      primary_industry: 'IT科技',
      deputy_industry: 'IT软件与服务',
      content:
        '{{first.DATA}}\n工作标题：{{keyword1.DATA}}\n执行人：{{keyword2.DATA}}\n完成时间：{{keyword3.DATA}}\n{{remark.DATA}}',
      example:
        '您好，亲发起的工作已经完成！\r\n工作标题：物业系统数据升级\r\n执行人：王冠宇\r\n完成时间：2017年3月2日 11点\r\n工作已圆满完成，请查看工作管理系统详情，并对照检查工作结果！',
      __typename: 'Template',
    },
    {
      template_id: '823D0qzKXHHT6mokOtalaVF6yc_c-tMblItLzPq_i0g',
      title: '自动智能执行成功通知',
      primary_industry: 'IT科技',
      deputy_industry: 'IT软件与服务',
      content:
        '{{first.DATA}}\n智能名称：{{keyword1.DATA}}\n执行结果：{{keyword2.DATA}}\n执行时间：{{keyword3.DATA}}\n{{remark.DATA}}',
      example:
        '执行成功状态内容示例\r\n智能名称：设备全开\r\n执行结果：执行成功\r\n执行时间：2020-07-27  12:04:25\r\n设备智能执行成功！',
      __typename: 'Template',
    },
  ];
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
  // if (templatesService?.data) {
  //   const {
  //     data: { templates },
  //   } = templatesService;
  //   if (templates.length) {
  //     templates.reduce((obj: teamplatesObjectType, cur: teamplateType) => {
  //       obj[cur.template_id] = cur;
  //       return obj;
  //     }, teamplatesObject);
  //   }
  // }
  if (templates.length) {
    templates.reduce((obj: teamplatesObjectType, cur: teamplateType) => {
      obj[cur.template_id] = cur;
      return obj;
    }, teamplatesObject);
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
