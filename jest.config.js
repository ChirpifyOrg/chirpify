module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   roots: ['<rootDir>'],
   modulePaths: ['<rootDir>'],
   moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1', // 절대 경로 매핑
   },
   transform: {
      '^.+\\.tsx?$': 'ts-jest',
   },
   testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
