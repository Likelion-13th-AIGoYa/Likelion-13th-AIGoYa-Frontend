# 📋 프로젝트 협업 가이드

## 🎯 개요
이 문서는 개발 프로젝트의 협업 규칙과 가이드라인을 정리한 것입니다.
팀원 모두가 일관성 있고 효율적으로 협업할 수 있도록 반드시 숙지해주세요.

## 🌿 Git 브랜치 전략 (GitHub Flow)

### 기본 원칙
- **절대 main 브랜치에서 직접 작업 금지** ❌
- 모든 작업은 별도 브랜치에서 → PR → 리뷰 → 머지 순서로 진행
- main은 항상 배포 가능한 상태로 유지

### 브랜치 네이밍 규칙
```

feature/기능설명    \# 새로운 기능 개발
bugfix/버그설명     \# 버그 수정
design/디자인설명   \# UI/UX 디자인 작업
docs/문서명         \# 문서 작업

```

**예시:**
```


# ✅ 올바른 브랜치명

git checkout -b feature/login-page
git checkout -b bugfix/header
git checkout -b design/main-page
git checkout -b docs/readme

# ❌ 잘못된 브랜치명

git checkout -b login
git checkout -b fix
git checkout -b my-branch

```

### 작업 플로우
1. **이슈 생성** → GitHub Issues에서 작업 내용 정의
2. **⚠️ 최신 코드 pull** → `git pull origin main`으로 최신 상태 동기화
3. **브랜치 생성** → main에서 새 브랜치 생성
4. **개발 작업** → 해당 브랜치에서 코드 작성
5. **커밋&푸시** → 해당 브랜치로 add/commit/push
6. **PR 생성** → Pull Request로 리뷰 요청
7. **코드 리뷰** → 팀원 승인 후 머지
8. **브랜치 삭제** → 머지 후 자동 삭제

## 📝 커밋 컨벤션 (Conventional Commits)

### 커밋 메시지 형식
```

타입(스코프): 제목

본문 (선택사항)

푸터 (선택사항)

```

### 커밋 타입
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `design`: UI/UX 디자인 변경
- `docs`: 문서 수정
- `refactor`: 코드 리팩토링 (기능 변경 없음)
- `chore`: 빌드, 설정 파일 수정

### 커밋 메시지 예시
```


# ✅ 올바른 커밋 메시지

git commit -m "feat: 로그인 페이지 UI 구현"
git commit -m "bugfix: 헤더 메뉴 모바일 오버랩 수정"
git commit -m "design: 메인 페이지 반응형 레이아웃 적용"
git commit -m "docs: README에 설치 가이드 추가"

# ❌ 잘못된 커밋 메시지

git commit -m "수정"
git commit -m "로그인"
git commit -m "fixed bug"
git commit -m "added new feature"

```

### 상세 커밋 메시지 예시
```

feat: 사용자 인증 시스템 구현

- JWT 토큰 기반 로그인/로그아웃 기능
- 자동 로그인 유지 기능
- 로그인 상태에 따른 라우팅 가드

Closes \#15

```

## 🔄 Git 작업 수칙

### 필수 규칙
- **작업 시작 전 반드시 최신 코드로 pull** ⚠️
- **'-f' 와 같은 강제 푸시(force push) 절대 금지** ❌
- 커밋은 작은 단위로 자주 하기

### 올바른 Git 워크플로우
```


# 1. 작업 시작 전 main 브랜치로 이동

git checkout main

# 2. 최신 코드 가져오기 (필수!)

git pull origin main

# 3. 새 브랜치 생성

git checkout -b feature/login-page

# 4. 작업 후 커밋

git add .
git commit -m "feat: 로그인 폼 컴포넌트 추가"

# 5. 해당 원격 브랜치에 푸시

git push origin feature/login-page

# 6. GitHub에서 PR 생성

```

### 충돌 해결 시
```


# ✅ 올바른 방법

git checkout main
git pull origin main
git checkout feature/login-page
git merge main  \# 또는 git rebase main

# ❌ 절대 금지

git push --force
git push -f

```

### 금지사항
```


# ❌ 이런 명령어들은 절대 사용 금지

git push --force
git push -f
git push --force-with-lease

# ❌ main 브랜치에서 직접 작업

git checkout main
git add .
git commit -m "작업"  \# 절대 금지!

```

## 🎫 이슈(Issue) 관리

### 필수 규칙
- **모든 작업은 이슈부터 생성** 
- 수정/추가할 내용이 있으면 반드시 이슈 등록 후 작업 시작
- 이슈 없는 PR은 원칙적으로 머지 금지

### 이슈 작성 가이드
```

제목: [타입] 간단한 설명
예시: [feat] 로그인 페이지 구현
[bugfix] 모바일 메뉴 오버랩 수정
[design] 메인 페이지 반응형 적용

```

### 이슈-PR 연결 예시
```


# PR 본문 예시

## 📝 작업 내용

로그인 페이지 UI 구현 및 기본 유효성 검사 추가

## 🔗 관련 이슈

Closes \#12

## ✅ 체크리스트

- [x] 로그인 폼 컴포넌트 생성
- [x] 이메일/비밀번호 유효성 검사
- [x] 반응형 디자인 적용

```

## 🎨 CSS 스타일링 규칙

### CSS 모듈 사용 필수

기존의 mainPage.css가 아니라 mainPage.module.css로 사용

이유: 기존 방식으로는 클래스명 중복이 발생함

```

/* ✅ 올바른 예시 */
/* components/Header/Header.module.css */
.header {
background-color: \#fff;
padding: 1rem;
}

.navigation {
display: flex;
gap: 1rem;
}

.logo {
font-size: 1.5rem;
font-weight: bold;
}

```

```

// ✅ 컴포넌트에서 사용
import styles from './Header.module.css';

function Header() {
return (
<header className={styles.header}>
<div className={styles.logo}>로고</div>
<nav className={styles.navigation}>
<a href="/">홈</a>
<a href="/about">소개</a>
</nav>
</header>
);
}

```

### CSS 파일 네이밍 예시
```


# ✅ 올바른 구조

src/
├── components/
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── Header.module.css
│   ├── LoginForm/
│   │   ├── LoginForm.jsx
│   │   └── LoginForm.module.css
│   └── Button/
│       ├── Button.jsx
│       └── Button.module.css

```

### 금지사항 예시
```

/* ❌ 전역 CSS 사용 금지 */
/* styles/global.css */
.header {
background: white; /* 다른 컴포넌트와 충돌 위험 */
}

.button {
padding: 10px; /* 클래스명 중복 위험 */
}

```

```

// ❌ 인라인 스타일 남발 금지
function Header() {
return (
<header style={{
backgroundColor: 'white',
padding: '1rem',
display: 'flex'  // CSS 모듈 사용 권장
}}>
헤더
</header>
);
}

```

## 🤖 AI 도구 활용 가이드

### 기본 원칙
- AI 도구(ChatGPT, Copilot 등) 적극 활용 권장
- **단, 반드시 기존 코드 보존 확인** ⚠️

### 권장 AI 요청 예시
```

✅ 좋은 AI 요청:
"기존 LoginForm 컴포넌트에서 기존 코드를 모두 유지한 채로
이메일 유효성 검사 기능만 추가해줘"

"현재 Header.module.css에서 기존 스타일을 그대로 두고
모바일 반응형 스타일만 추가해줘"

❌ 위험한 AI 요청:
"LoginForm을 완전히 새로 작성해줘"
"이 코드를 더 좋게 리팩토링해줘"
"전체 컴포넌트를 다시 만들어줘"

```

## 📝 PR(Pull Request) 가이드

### PR 생성 전 체크리스트
- [ ] 이슈가 먼저 생성되어 있는가?
- [ ] 작업 전 `git pull origin main`으로 최신 코드를 받았는가?
- [ ] 브랜치명이 규칙에 맞는가?
- [ ] 커밋 메시지가 컨벤션을 따르는가?
- [ ] 기능이 정상 동작하는가?
- [ ] CSS 모듈 규칙을 지켰는가?
- [ ] 기존 코드가 누락되지 않았는가?

### PR 제목 규칙 예시
```

[타입] \#이슈번호: 작업 내용 요약

✅ 올바른 예시:
[feat] 로그인 페이지 UI 구현
[bugfix] 헤더 메뉴 모바일 반응형 수정
[design] 메인 페이지 컬러 테마 적용
[docs] 협업 가이드 문서 업데이트

❌ 잘못된 예시:
로그인 페이지
버그 수정
UI 개선
문서 수정

```

### 필수 리뷰 사항
- 기능 동작 확인
- CSS 모듈 사용 여부
- 기존 코드 보존 여부
- 커밋 컨벤션 준수 여부
- 코드 품질 및 가독성

## 🏷️ 라벨 시스템

### 이슈/PR 공통 라벨
- `🎯 feat`: 새로운 기능 개발
- `🐞 fix`: 버그 수정
- `🎨 design`: UI/UX 디자인 작업  
- `📝 docs`: 문서 작성/수정

### 우선순위 라벨
- `🔥 urgent`: 긴급 (데모 전 필수)
- `⭐ high`: 높음 (우선 처리)
- `💤 low`: 낮음 (시간 있으면)

### 라벨 사용 예시
```

이슈 제목: [feat] 사용자 대시보드 구현
라벨: 🎯 feat, ⭐ high

이슈 제목: [bugfix] 로그인 폼 유효성 검사 오류
라벨: 🐞 bugfix, 🔥 urgent

이슈 제목: [design] 버튼 컴포넌트 스타일 개선
라벨: 🎨 design, 💤 low

```

## 🚨 주의사항 및 금지사항

### 절대 금지
❌ main 브랜치에서 직접 수정
❌ 이슈 없이 PR 생성
❌ 전역 CSS 사용 (module.css 필수)  
❌ AI가 생성한 코드를 검토 없이 그대로 사용
❌ 기존 코드 무단 삭제 또는 대폭 수정
❌ **강제 푸시 (git push --force) 사용**
❌ **작업 전 최신 코드 pull 하지 않기**
❌ **커밋 컨벤션 무시**

### 필수 확인사항 
✅ 모든 작업은 이슈 → 최신 코드 pull → 브랜치 → PR 순서
✅ CSS는 반드시 module.css 형태로 사용
✅ AI 도구 사용 후 기존 코드 보존 여부 확인
✅ PR 생성 전 로컬에서 빌드/실행 테스트
✅ 반응형 디자인 적용 (모바일/데스크톱)
✅ **커밋 메시지는 반드시 컨벤션 준수**
✅ **작업 시작 전 항상 git pull origin main**

## ⚠️ 자주 하는 실수 및 해결법

### 1. 작업 전 pull 하지 않아서 충돌 발생
```


# ❌ 실수 상황

git checkout -b feature/new-feature  \# pull 없이 바로 브랜치 생성

# ... 작업 후 ...

git push origin feature/new-feature  \# 충돌 발생!

# ✅ 올바른 방법

git checkout main
git pull origin main  \# 필수!
git checkout -b feature/new-feature

```

### 2. 강제 푸시로 팀원 코드 손실
```


# ❌ 절대 금지

git push --force  \# 다른 팀원의 작업이 사라질 수 있음!

# ✅ 올바른 해결법

git pull origin main
git merge main  \# 충돌 해결
git push origin feature/branch-name

```

### 3. 커밋 컨벤션 무시
```

# ❌ 잘못된 커밋

git commit -m "수정함"
git commit -m "버그 고침"
git commit -m "added login"

# ✅ 올바른 커밋

git commit -m "feat: 로그인 폼 컴포넌트 추가"
git commit -m "bugfix: 헤더 메뉴 모바일 오버랩 수정"
git commit -m "design: 메인 페이지 색상 테마 적용"

```

### Git 명령어 치트시트
```

# 기본 워크플로우

git status                    \# 상태 확인
git pull origin main         \# 최신 코드 가져오기
git checkout -b feature/12   \# 새 브랜치 생성
git add .                    \# 변경사항 스테이징
git commit -m "feat: 기능 추가"  \# 커밋
git push origin feature/12   \# 원격에 푸시

# 유용한 명령어

git log --oneline           \# 커밋 히스토리 간략히 보기
git branch -a              \# 모든 브랜치 확인
git checkout main          \# main 브랜치로 이동
git branch -d feature/12   \# 로컬 브랜치 삭제

```

## 🔧 트러블슈팅

### 자주 발생하는 문제

1. **CSS 클래스가 적용 안됨**
```

// ❌ 잘못된 사용
import './Header.module.css';
<div className="header">  // 적용 안됨

// ✅ 올바른 사용
import styles from './Header.module.css';
<div className={styles.header}>  // 정상 적용

```

2. **브랜치 충돌 해결**
```

# 충돌 발생 시

git checkout main
git pull origin main
git checkout feature/branch-name
git merge main  \# 충돌 해결 후
git add .
git commit -m "resolve: merge conflict resolved"
git push origin feature/branch-name

```

3. **AI가 기존 코드를 지웠을 때**
```

git diff HEAD~1  \# 이전 커밋과 비교
git checkout HEAD~1 -- src/components/Header.jsx  \# 특정 파일 복구

# 또는

git reset HEAD~1  \# 마지막 커밋 취소 (주의해서 사용)

```

4. **잘못된 커밋 메시지 수정**
```

# 마지막 커밋 메시지 수정 (아직 push 안한 경우)

git commit --amend -m "feat: 올바른 커밋 메시지"

# 이미 push한 경우는 그대로 두고 다음부터 올바르게 작성

```