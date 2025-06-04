export const safeJsonStringify = (obj: any): string =>
   JSON.stringify(obj, (_key, value) => (typeof value === 'bigint' ? value.toString() : value));
