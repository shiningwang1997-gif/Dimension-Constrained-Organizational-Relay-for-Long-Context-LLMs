// types.ts
export interface ConfigItem {
  id: string;
  name: string;
  cate: string; // 分类
  value?: string; // 存储的值
}

export interface ConfigCategory {
  name: string;
  items: ConfigItem[];
}
