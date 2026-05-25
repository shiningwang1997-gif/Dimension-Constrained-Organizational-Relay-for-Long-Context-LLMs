import { writable } from 'svelte/store';

type ConfirmOptions = {
    title?: string;
    message: string;
};

type ConfirmState = {
    isOpen: boolean;
    options: ConfirmOptions;
    callback: ((confirmed: boolean) => void) | null;
};

// 创建全局 store
const initialState: ConfirmState = {
    isOpen: false,
    options: { title: '确认', message: '' },
    callback: null
};

export const confirmStore = writable<ConfirmState>(initialState);

// 显示确认对话框
export function showConfirm(options: ConfirmOptions, callback: (confirmed: boolean) => void) {
    confirmStore.set({
        isOpen: true,
        options,
        callback
    });
}

// 关闭对话框并处理结果
export function handleConfirmResult(confirmed: boolean) {
    confirmStore.update((state) => {
        if (state.callback) {
            state.callback(confirmed);
        }
        return { ...initialState };
    });
}
