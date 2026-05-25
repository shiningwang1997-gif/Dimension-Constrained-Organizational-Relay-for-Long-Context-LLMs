import { mapValues, isString, isArray } from 'remeda';
import { decodeHTML } from 'entities';

// 自定义 isObject 函数
function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function deepTransform<T>(
    obj: T,
    transform: (value: string) => string
): T {
    if (obj === null || obj === undefined || !isObject(obj)) {
        return obj;
    }

    if (isArray(obj)) {
        return obj.map(item => deepTransform(item, transform)) as T;
    }

    return mapValues(obj, (value) => {
        if (isString(value)) {
            return transform(value);
        } else if (isObject(value)) {
            return deepTransform(value, transform);
        } else {
            return value;
        }
    }) as T;
}

// 使用示例
export const decodeObjectStrings = <T>(obj: T) => deepTransform(obj, decodeHTML);
