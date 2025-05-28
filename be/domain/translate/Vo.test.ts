import { TranslateModelUseType } from '@/types/translate';
import { TranslateModelUseTypeVO } from './Vo';

// 테스트에 필요한 모의 데이터
const VALID_USE_TYPE: TranslateModelUseType = 'feedback';
const OTHER_VALID_USE_TYPE: TranslateModelUseType = 'sentence';
const INVALID_USE_TYPE = 'invalid_type';

describe('TranslateModelUseTypeVO', () => {
   describe('생성(create)', () => {
      describe('유효한 useType이 주어졌을 때', () => {
         // Given
         const validUseType = VALID_USE_TYPE;

         it('TranslateModelUseTypeVO 인스턴스가 생성되어야 한다', () => {
            // When
            const useTypeVO = TranslateModelUseTypeVO.create(validUseType);

            // Then
            expect(useTypeVO).toBeDefined();
            expect(useTypeVO.toString()).toBe(validUseType);
         });
      });

      describe('유효하지 않은 useType이 주어졌을 때', () => {
         // Given
         const invalidUseType = INVALID_USE_TYPE;

         it('에러를 던져야 한다', () => {
            // When & Then
            expect(() => {
               TranslateModelUseTypeVO.create(invalidUseType);
            }).toThrow('잘못된 useType 값입니다');
         });
      });
   });

   describe('비교(equals)', () => {
      describe('동일한 값의 두 VO가 주어졌을 때', () => {
         // Given
         const useTypeVO1 = TranslateModelUseTypeVO.create(VALID_USE_TYPE);
         const useTypeVO2 = TranslateModelUseTypeVO.create(VALID_USE_TYPE);

         it('equals 메소드는 true를 반환해야 한다', () => {
            // When
            const result = useTypeVO1.equals(useTypeVO2);

            // Then
            expect(result).toBe(true);
         });
      });

      describe('다른 값의 두 VO가 주어졌을 때', () => {
         // Given
         const useTypeVO1 = TranslateModelUseTypeVO.create(VALID_USE_TYPE);
         const useTypeVO2 = TranslateModelUseTypeVO.create(OTHER_VALID_USE_TYPE);

         it('equals 메소드는 false를 반환해야 한다', () => {
            // When
            const result = useTypeVO1.equals(useTypeVO2);

            // Then
            expect(result).toBe(false);
         });
      });
   });

   describe('문자열 변환(toString)', () => {
      describe('VO가 주어졌을 때', () => {
         // Given
         const useType = VALID_USE_TYPE;
         const useTypeVO = TranslateModelUseTypeVO.create(useType);

         it('toString 메소드는 내부 값을 문자열로 반환해야 한다', () => {
            // When
            const result = useTypeVO.toString();

            // Then
            expect(result).toBe(useType);
         });
      });
   });
});
