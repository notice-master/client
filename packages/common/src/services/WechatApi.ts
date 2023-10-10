import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { WECHAT_API_HOST } from '../constants';
import type { IIMessageTemplateResponse } from '../types';

export const wechatBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params: {
          access_token:
            '73_tqJfbdLfvmxopc4Zrg9YNYUdntGjsZej9-WkZwUQqMdrzi24wABkpsmU80xpm8IT0IGIbvqEqD7D_2mXv14R3Kl73WPFyxMWloIgVvsqT7ooxgTQI6buOxfc-XERVKjADANRG',
          ...params,
        },
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const WechatApi = createApi({
  reducerPath: 'wechat-api',
  baseQuery: wechatBaseQuery({
    baseUrl: WECHAT_API_HOST,
  }),
  endpoints: (builder) => ({
    getAllPrivateTemplate: builder.query<IIMessageTemplateResponse, void>({
      query: () => ({
        url: '/cgi-bin/template/get_all_private_template',
        method: 'get',
      }),
    }),
  }),
});
