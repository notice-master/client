export const useGetTemplates = () => {
  return [
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
};
