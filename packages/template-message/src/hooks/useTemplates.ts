import { useState, useEffect } from 'react';
import { useSelector, useManageDBInstance, WechatApi } from '@nmc/common';
import type { GlobalState } from '@nmc/common';
import type { IDBPDatabase } from '@nmc/idb';

export const useTemplates = () => {
  const { useLazyGetAllPrivateTemplateQuery } = WechatApi;
  const [getTemplates, tplResult] = useLazyGetAllPrivateTemplateQuery();
  const { appId = '' } = useSelector<{ global: GlobalState }, GlobalState>(
    (state) => state?.global || {}
  );
  const { db: manageDB } = useManageDBInstance(
    appId,
    3,
    (_db, oldVersion, newVersion, transaction, event) => {
      const templatesStore = _db.createObjectStore('templates', {
        keyPath: 'index',
        autoIncrement: true,
      });
      templatesStore.createIndex('template_id', 'template_id');
      templatesStore.createIndex('type', 'type');
    }
  );

  useEffect(() => {
    getTemplates();
  }, []);
  return {
    getTemplates,
    templates: [...(tplResult?.data?.template_list || [])],
  };
};
