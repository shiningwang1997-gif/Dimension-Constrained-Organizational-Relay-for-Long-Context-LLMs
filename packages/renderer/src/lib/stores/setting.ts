import { readable, type Readable } from "svelte/store";
import { rpc } from "@app/preload";

export interface Setting {
  id: string;
  value: string;
  [key: string]: any;
}

interface SettingState {
  data: Setting;
  loading: boolean;
  error: string | null;
}

interface SettingStore extends Readable<SettingState> {
  load(): Promise<string>;
  save(value: string): Promise<void>;
}

export const createSettingStore = (id: string): SettingStore => {
  let state: SettingState = {
    data: { id, value: "" },
    loading: true,
    error: null,
  };

  const subscribers = new Set<(value: SettingState) => void>();

  const updateState = (newState: Partial<SettingState>) => {
    state = { ...state, ...newState };
    subscribers.forEach((callback) => callback(state));
  };

  const store: SettingStore = {
    subscribe(callback: (value: SettingState) => void) {
      subscribers.add(callback);
      callback(state);

      return () => {
        subscribers.delete(callback);
      };
    },

    async load(): Promise<string> {
      updateState({ loading: true, error: null });

      try {
        const value = await rpc.setting.get(id);
        updateState({
          data: { id, value },
          loading: false,
          error: null,
        });
        return value;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        updateState({ loading: false, error: errorMessage });
      }
      return "";
    },

    async save(value: string): Promise<void> {
      updateState({ loading: true, error: null });

      try {
        const updatedSetting = {
          ...state.data,
          ...{
            value,
          },
        };

        // 保存到RPC
        await rpc.setting.set(id, value);

        // 直接更新state
        state.data = updatedSetting;
        updateState({ loading: false, error: null });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        updateState({ loading: false, error: errorMessage });
      }
    },
  };

  return store;
};
