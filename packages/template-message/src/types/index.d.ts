interface TemplateFieldHandles {
  insertTag: () => void;
}
interface TemplateFieldGroupHandles {
  insertTag: (string) => void;
}
type TemplateFieldType = {
  name: string;
  type?: string;
  onFucus?: (focusedInputName: string) => void;
};
type insertTagCallbackFunction = (tag: string) => void;
type templateFieldValueType = {
  value: string | undefined;
  color: string | undefined;
};
type templateDataType = {
  touser?: string | undefined;
  remark_title?: string | undefined;
  template_id?: string | undefined;
  url?: string | undefined;
  miniprogram?: {
    appid?: string | undefined;
    pagepath?: string | undefined;
  };
  data?:
    | {
        [key: string]: templateFieldValueType;
      }
    | {};
};
interface ITemplateData {
  content: string;
  deputy_industry: string;
  example: string;
  primary_industry: string;
  template_id: string;
  title: string;
}
interface IMaterialTemplateMessageDetail {
  id: string;
  requestData: any;
  templateData: ITemplateData;
  type: 'template-message';
}
