export interface IMessageTemplate {
  template_id: string;
  title: string;
  primary_industry?: string;
  deputy_industry?: string;
  content: string;
  example: string;
}

export interface IIMessageTemplateResponse {
  template_list: IMessageTemplate[];
}
