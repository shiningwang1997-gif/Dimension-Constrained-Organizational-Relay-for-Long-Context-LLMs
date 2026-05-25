// lib/stores/theme.ts

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { eventBus } from '$lib/events/bus';

// 修改完这里的值，记得同步更新tailwind.config.ts中的defaultTheme及darkTheme以及themes的值。
export const THEME = {
  LIGHT: 'cupcake',
  DARK: 'dim'
} as const;

export type Theme = typeof THEME[keyof typeof THEME];

const createThemeStore = () => {
  const defaultTheme = browser ? localStorage.getItem('theme') as Theme || THEME.LIGHT : THEME.LIGHT;
  const { subscribe, set } = writable<Theme>(defaultTheme);

  // 监听其他标签页的主题变化
  eventBus.on('storage', (event) => {
    if (event.key === 'theme' && event.newValue) {
      const newTheme = event.newValue as Theme;
      set(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  });

  return {
    subscribe,
    toggle: () => {
      if (browser) {
        const current = document.documentElement.getAttribute('data-theme') as Theme;
        const newTheme = current === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        set(newTheme);
      }
    },
    isDark: (theme: Theme) => theme === THEME.DARK
  };
};

export const theme = createThemeStore();