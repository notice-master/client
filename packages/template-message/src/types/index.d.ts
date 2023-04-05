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
