
## feat: 게시판 기본 기능 (리스트, 등록, 상세보기) 구현

<br>

## PR 개요
- 게시판 기본 기능을 먼저 구현했습니다.

- 게시글 목록 조회, 게시글 등록, 게시글 상세보기 (비밀번호 검증 포함)
- 첨부파일은 업로드까지 구현 (다운로드 미구현)
- 미구현 기능들은 아래에 체크박스로 정리했습니다.
<br>

## 주요 변경 내용
**1. 엔티티 및 레포지토리**
- Board / BoardFile 엔티티 및 JPA 레포지토리 구조 마련
     - 비밀번호(4자리) 저장 시, BCrypt를 사용해 암호화
<br>

**2. 서비스 레이어**
- BoardService
     - createBoard(...): 게시글과 첨부파일 업로드 처리
     - getList(...): 페이징과 공지글 정렬 우선순위 반영
     - getBoardDetailOrProtected(...): 비밀번호 있는 글의 경우, 비밀번호 검증
     - deleteBoard(...): 비밀번호 검증 후 삭제
<br>

**3. 컨트롤러**
- BoardApiController
     - /api/board/list: 목록 조회
     - /api/board/write: 등록 (multipart/form-data)
     - /api/board/detail/{id}: 상세보기 (비밀번호 검증 옵션)
<br>

**4. 기타 설정**
- SecurityConfig: CORS 설정 및 로그인 폼 비활성화
- application.properties: MySQL 연결, JPA 설정
<br>

## 동작 확인 방법
**1. 게시글 등록**
- POST /api/board/write
- form-data로 "boardDTO" JSON + "files" 업로드
<br>

**2. 게시글 목록**
- GET /api/board/list?page=1&size=10
- 공지글(notice)이 우선 정렬되고, 그 다음 ID 내림차순
<br>

**3. 게시글 상세**
- GET /api/board/detail/{id}
- 비밀글이면 ?password=1234와 같이 쿼리 파라미터로 비밀번호 전달
<br>

**4. 게시글 삭제**
- POST /api/board/delete/{id}
- Body JSON 예: {"password":"1234"}

## 현재 구현됨
- [x] 게시글 리스트 (페이징, 공지글 우선 정렬)
- [x] 게시글 등록 (파일 업로드 가능)
- [x] 게시글 상세보기 (비밀번호 검증, 첨부파일 목록 조회)
- [ ] 게시글 삭제 (비밀번호 검증, 백엔드만 구현)
 
## 미구현(추후 추가 예정)
- [ ] 첨부파일 다운로드
- [ ] 게시글 관련(수정 폼, 수정, 삭제)
- [ ] 답글 기능 (답글 작성/수정/삭제)
- [ ] 댓글 기능 (댓글 작성/수정/삭제, 비밀번호 체크)
- [ ] 검색 (제목/내용/제목+내용 + 검색어 하이라이팅)
- [ ] 작성자 클릭 시 이메일 보내기 (비밀번호 검증, 이메일 필수항목 체크)

 ## 수정 예정
- [ ] 비밀번호 입력 후 url 보안
- [ ] 예외처리

 
