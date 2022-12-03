type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  children?: MenuItem[];
};

interface IconsTypes {
  [key: string]: ReactNode;
}