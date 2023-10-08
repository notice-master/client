import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { WECHAT_API_HOST } from '../constants';

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
            '73_5KyZY3uo1Wf93YsM9Exvg5E6EFoKmAoMTBXjafvjJLm3dFGjiDlYWiei1Q-Dn-qN_b9NNO4SY_VgDMcYTvgBcpUMlq9adDgWgM-FOHbLHgbkMU7sPdapb9u0xdEGQViAAARBG',
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
    getAllPrivateTemplate: builder.query<any, any>({
      query: () => ({
        url: '/cgi-bin/template/get_all_private_template',
        method: 'get',
      }),
    }),
  }),
});
