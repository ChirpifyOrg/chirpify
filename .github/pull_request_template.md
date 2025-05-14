## 🛠️ 주요 변경 사항

### ✅ 기능 추가 (Features)

- Chat Model List 페이지 스켈레톤 UI 및 목록 표시 구현

### 🔧 리팩토링 (Refactors)

- `uow`에서 가져오는 Prisma 객체를 싱글톤으로 감싸 일관성 확보
- `ChatUseCaseFactory`의 `getUseCase` 호출 시 구조 분해 할당 적용
- 잘못된 repository 참조 형태 수정

### 🐞 버그 수정 (Fixes)

- 익명 사용자 체크 로직 오류 수정
- `streaming` 중 발생하던 코드 오류 해결

### 🧹 기타 변경 (Chore & Cleanup)

- NavBar UI 및 위치 수정
