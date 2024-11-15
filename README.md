hoBIT-admin-frontend

## 처음 실행할 때 실행할 명령어
```
npm install -g typescript
npm install -g react-scripts
npm install
```

## 코드 작동 방식 설명(src)
```
1. envs.ts 
  1) src/envs.ts에서 env 파일을 읽어와 고정 endpoint 설정(http://localhost:3000)

2. /types 
  1) 다른 ts: types에서 api의 request와 response type을 명시
  2) api.ts: 다른 ts 파일을 import해 사용자 설정 api를 모두 설정

3. /apis
  1) apis: envs.ts와 types/apis를 읽어와 endpoint를 확장후 Get, Post, Put, Delete(REST API) 에 맞게 type을 적용하며 api를 설계
  2) method에 대한 path, request, resonse 를 구성

4. /hooks 
  1) 위에서 설계한 api를 React component에서 쉽게 사용할 수 있도록 훅을 설계(이때도 type을 이용)
  2) useHobitQueryApi(GET), useHobitMutateApi(POST)

5. /componet
  1) 한페이지(UI)에서 재사용 가능한 기능이 구현(버튼, 입력필드, 헤더)
  2) 최종적으로 만들어진 hook가 여기서 사용 됌

6. /pages
  1) page를 담당(component 들이 조합 됌)
  2) 페이지간 이동도 여기서 정의 (useNavigate) + APP.tsx

7. /lib
  1) 애플리케이션 전반에 걸쳐 공통으로 사용될 수 있는 유틸리티 코드나 기능을 모아두는 곳(자동 완성, 날짜 포맷)

8. /redux
  1) 상태관리(로그인 상태, 로딩 상태, 데이터 캐싱)
  2) 현재 구현되어 있는것은 입력창에 입력이 되야 버튼이 활성화되는 기능

9. /lib
  1) 검색어 자동완성 기능
```
