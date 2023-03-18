import * as allIcons from '@ant-design/icons';
import { getKeyByPath, getPathByKey } from '@nmc/common';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { menuData } from '../routes';

type TIconNames = keyof typeof allIcons;

const LEFT_MENU_COLLAPSED = 'LEFT_MENU_COLLAPSED';
const LEFT_MENU_CACHED_OPEND = 'LEFT_MENU_CACHED_OPEND';

const LeftMenu = () => {
  const { pathname } = useLocation();
  const { SubMenu } = Menu;
  const { Sider } = Layout;
  const leftMenuCollapsed = localStorage.getItem(LEFT_MENU_COLLAPSED);
  const [collapsed, toggleCollapse] = useState(leftMenuCollapsed === 'true');
  const onCollapse = (collapsed: boolean) => {
    toggleCollapse(collapsed);
    localStorage.setItem(LEFT_MENU_COLLAPSED, collapsed ? 'true' : 'false');
  };
  const [menuMapping, setMenuMapping] = useState<Map<string, MenuItem>>(
    new Map()
  );
  let defaultOpenMenuKeys = [];
  try {
    defaultOpenMenuKeys = JSON.parse(
      localStorage.getItem(LEFT_MENU_CACHED_OPEND) || ''
    );
  } catch (e) {
    console.error(e);
  }
  const [openMenuKeys, setOpenMenuKeys] =
    useState<string[]>(defaultOpenMenuKeys);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]);
  const getIcon = <T extends TIconNames>(key: T | string | undefined) => {
    if (!key || !(key in allIcons)) {
      return <></>;
    }
    const Component = allIcons[key as T] as any;
    return <Component />;
  };
  const renderMenuList = (
    data: MenuItem[],
    sourceMapping: Map<string, MenuItem> | undefined
  ): MenuProps['items'] => {
    return data.map((item: MenuItem) => {
      const { key, title, children = [], icon } = item;
      if (sourceMapping) {
        setMenuMapping(sourceMapping.set(key, item));
      }
      if (item?.children?.length) {
        return {
          label: title,
          key: key,
          icon: getIcon(icon),
          children: renderMenuList(children, sourceMapping),
        };
      } else {
        return {
          label: <Link to={getPathByKey(key)}>{title}</Link>,
          key: key,
          icon: getIcon(icon),
        };
      }
    });
  };

  const getDefaultActiveItems = (
    pathname: string
  ): { openMenuKeys: string[]; selectedMenuKeys: string[] } => {
    const openMenuSet = new Set<string>([]);
    const selectedMenuSet = new Set<string>([]);
    if (pathname) {
      let currentMenuKey = getKeyByPath(pathname);
      while (currentMenuKey) {
        const menuNode = menuMapping.get(currentMenuKey);
        if (menuNode) {
          if (menuNode?.children?.length) {
            openMenuSet.add(currentMenuKey);
          } else {
            selectedMenuSet.add(currentMenuKey);
          }
        }
        currentMenuKey = currentMenuKey.split('/').slice(0, -1).join('/');
      }
    }
    return {
      openMenuKeys: Array.from(new Set([...openMenuKeys, ...openMenuSet])),
      selectedMenuKeys: Array.from(selectedMenuSet),
    };
  };
  useEffect(() => {
    const { openMenuKeys, selectedMenuKeys } = getDefaultActiveItems(pathname);
    setSelectedMenuKeys(
      Array.from(new Set([...selectedMenuKeys, ...selectedMenuKeys]))
    );
    setOpenMenuKeys(Array.from(new Set([...openMenuKeys, ...openMenuKeys])));
  }, [pathname]);

  const menuItems = useMemo(() => {
    return renderMenuList(menuData, menuMapping);
  }, [menuData]);

  const menu = useMemo(() => {
    localStorage.setItem(LEFT_MENU_CACHED_OPEND, JSON.stringify(openMenuKeys));
    return (
      <Menu
        theme="dark"
        openKeys={openMenuKeys}
        selectedKeys={selectedMenuKeys}
        onOpenChange={(openKeys) => {
          setOpenMenuKeys(openKeys);
        }}
        onSelect={({ selectedKeys }) => {
          setSelectedMenuKeys(selectedKeys);
        }}
        mode="inline"
        items={menuItems}
      />
    );
  }, [openMenuKeys, selectedMenuKeys]);

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo">NMC</div>
      {menu}
    </Sider>
  );
};

export default LeftMenu;
