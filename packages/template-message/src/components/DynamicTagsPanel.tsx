import { Card, Tooltip } from 'antd';
type DynamicTagsPanelProps = {
  onTagClick?: (tag: dynamicTagObj) => void;
};
type dynamicTagObj = {
  title: string;
  tag: string;
  description?: string;
};
const DynamicTagsPanel = (props: DynamicTagsPanelProps) => {
  const { onTagClick } = props;
  const dynamicTags: dynamicTagObj[] = [
    {
      title: '粉丝昵称',
      tag: '{-nick-name-}',
      description:
        '由于新规定，2021年12月27日之后，不再输出头像、昵称信息，所以一些新的粉丝可能无法正确显示昵称',
    },
    {
      title: '当前日期',
      tag: '{-now-date-}',
    },
    {
      title: '当前时间',
      tag: '{-now-time-}',
    },
    {
      title: '随机字符串（8位）',
      tag: '{-random-str-}',
    },
    {
      title: '随机数字（4位）',
      tag: '{-random-num-}',
    },
  ];
  const handleTagClick = (item: dynamicTagObj) => {
    if (onTagClick) {
      onTagClick(item);
    }
  };
  return (
    <Card
      title="动态标签"
      bodyStyle={{
        paddingTop: '10px',
      }}
    >
      在标签内容处点击选择要插入的位置,再点击下方标签即可插入
      <ul style={{ paddingLeft: '10px' }}>
        {dynamicTags.map((item) => {
          return (
            <li key={item.title}>
              <Tooltip title={item?.description}>
                <a
                  onClick={() => {
                    handleTagClick(item);
                  }}
                >{`${item.title}: ${item.tag}`}</a>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};
export default DynamicTagsPanel;
