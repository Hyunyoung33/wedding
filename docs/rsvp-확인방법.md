# 방명록·참석 여부(RSVP) 확인 방법 — 신랑·신부용

하객들이 남긴 방명록과 참석 여부는 Firebase(구글의 무료 데이터베이스)에 저장됩니다.
두 분만 구글 로그인으로 확인할 수 있어요.

## 확인 순서

1. https://console.firebase.google.com 접속 → 구글 계정으로 로그인
2. `wedding` 프로젝트 클릭 (Firebase 세팅 때 만든 프로젝트)
3. 왼쪽 메뉴에서 **Firestore Database** 클릭
4. 가운데 패널에서 컬렉션 선택:
   - **guestbook** — 방명록 (이름, 메시지, 작성일)
   - **rsvp** — 참석 여부 응답

## rsvp 항목 읽는 법

| 필드 | 뜻 |
|---|---|
| side | groom = 신랑측, bride = 신부측 |
| name | 응답자 성함 |
| attending | true = 참석, false = 불참 |
| count | 동행 인원 (본인 포함) |
| meal | true = 식사함, false = 식사 안 함 |

## 참석 인원 합계 내는 법

문서 수가 적으면 눈으로 세면 되고, 많아지면 저(Claude Code)에게
"참석 인원 집계해줘"라고 하시면 집계 스크립트를 돌려 표로 정리해 드립니다.

## 부적절한 방명록 글 지우는 법

Firestore Database → guestbook → 해당 문서 클릭 → 오른쪽 위 ⋮ 메뉴 → 문서 삭제.
(청첩장 화면에서는 누구도 글을 수정·삭제할 수 없게 막아뒀습니다. 삭제는 이 콘솔에서만 가능해요.)
