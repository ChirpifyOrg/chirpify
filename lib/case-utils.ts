/**
 * Case Conversion Utilities
 * Convert between camelCase and snake_case
 */

/**
 * Convert camelCase to snake_case
 * Example: "userName" => "user_name"
 */
export function camelToSnake(str: string): string {
   return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 * Example: "user_name" => "userName"
 */
export function snakeToCamel(str: string): string {
   return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert object keys from camelCase to snake_case recursively
 * Example : 
 * 
const snakeData = {
  raw_message: {
    message: 'hi',
    total_feedback: {
      en: 'Hello!',
      ko_kr: '안녕하세요!',
      meta_data: {
        some_deep_key: 'value'
      }
    },
    keep_this_key: true
  },
  created_at: new Date()
};

const exclude = {
  keys: new Set(['ko_kr']), // 이 key 이름은 변환 안함
  paths: new Set(['raw_message.total_feedback.meta_data']) // 이 경로는 통째로 변환 안함
};

const result = objectSnakeToCamel(snakeData, exclude);

console.dir(result, { depth: null });
 */
type ExcludeOption = {
   keys?: Set<string>; // key 이름 단위로 제외
   paths?: Set<string>; // 경로 단위로 제외 (예: "rawMessage.totalFeedback.ko-KR")
};

export function objectCamelToSnake(obj: any, exclude?: ExcludeOption, path: string[] = []): any {
   if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
      return obj;
   }

   if (Array.isArray(obj)) {
      return obj.map((item, idx) => objectCamelToSnake(item, exclude, [...path, idx.toString()]));
   }

   return Object.entries(obj).reduce(
      (acc, [key, value]) => {
         const fullPath = [...path, key].join('.');

         const shouldExclude = exclude?.keys?.has(key) || exclude?.paths?.has(fullPath);

         const transformedKey = shouldExclude ? key : camelToSnake(key);
         acc[transformedKey] = objectCamelToSnake(value, exclude, [...path, key]);

         return acc;
      },
      {} as Record<string, any>,
   );
}
/**
 * Convert object keys from snake_case to camelCase recursively
 */

export function objectSnakeToCamel(obj: any, exclude?: ExcludeOption, path: string[] = []): any {
   if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
      return obj;
   }

   if (Array.isArray(obj)) {
      return obj.map((item, idx) => objectSnakeToCamel(item, exclude, [...path, idx.toString()]));
   }

   return Object.entries(obj).reduce(
      (acc, [key, value]) => {
         const fullPath = [...path, key].join('.');

         const shouldExclude = exclude?.keys?.has(key) || exclude?.paths?.has(fullPath);

         const transformedKey = shouldExclude ? key : snakeToCamel(key);
         acc[transformedKey] = objectSnakeToCamel(value, exclude, [...path, key]);

         return acc;
      },
      {} as Record<string, any>,
   );
}

// Usage examples:

// Convert a single string
// const snakeCaseStr = camelToSnake('userId'); // 'user_id'
// const camelCaseStr = snakeToCamel('user_id'); // 'userId'

// Convert an entire object and its nested properties
// const camelCaseObj = {
//   userId: 123,
//   userProfile: {
//     firstName: 'John',
//     lastName: 'Doe',
//     addressInfo: {
//       streetName: 'Main St'
//     }
//   },
//   createdAt: new Date()
// };

// const snakeCaseObj = objectCamelToSnake(camelCaseObj);
// Output:
// {
//   user_id: 123,
//   user_profile: {
//     first_name: 'John',
//     last_name: 'Doe',
//     address_info: {
//       street_name: 'Main St'
//     }
//   },
//   created_at: [Date object]
// }

// And convert back
// const backToCamel = objectSnakeToCamel(snakeCaseObj);
