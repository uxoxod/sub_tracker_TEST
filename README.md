<div align="center">

# 🚀 AI 실무활용 × GitHub 실습

### LG화학 K-뉴딜 아카데미 · 2026.10.22 ~ 10.23

*AI와 함께 코드를 짜고, GitHub로 기록하고 공유하는 2일간의 실습 저장소*

<br>

![Academy](https://img.shields.io/badge/LG화학-K--뉴딜_아카데미-A50034?style=for-the-badge)
![Course](https://img.shields.io/badge/과정-AI_실무활용-6759E8?style=for-the-badge)
![Date](https://img.shields.io/badge/기간-2026.10.22~23-4BBD9B?style=for-the-badge)

![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-D97757?style=flat-square&logo=anthropic&logoColor=white)

</div>

---

## 👋 About

**LG화학 K-뉴딜 아카데미**의 **AI 실무활용** 과정을 들으며, 그 안의 **GitHub 강의**에서 배운 내용을 직접 손으로 따라 해 보고 기록하는 저장소다.

"AI에게 일을 시키는 법"과 "그 결과물을 버전으로 관리하는 법"을 함께 익히는 것이 목표다.

> 💡 **한 줄 요약**  
> 프롬프트로 만들고 → 코드로 확인하고 → Git으로 남긴다.

---

## 🗓️ 학습 타임라인

| 날짜 | 주제 | 상태 |
|:---:|---|:---:|
| **10.22 (목)** | 개발 환경 세팅, JavaScript 기초, GitHub 기본, 미니 프로젝트 | ✅ |
| **10.23 (금)** | GitHub 협업 흐름 · AI 활용 심화 · 결과물 정리 | 🔜 |

---

## 🎯 학습 목표

- [x] VS Code 개발 환경 세팅 (Claude Code, Copilot 연동)
- [x] Node.js로 JavaScript 실행해 보기
- [x] 함수 단위로 로직 나누어 작성하기
- [x] HTML · CSS · JS 파일을 분리해 웹페이지 만들기
- [ ] Git 커밋 · 푸시로 작업 기록 남기기
- [ ] 브랜치 · Pull Request 흐름 익히기
- [ ] AI 도구를 업무 흐름에 연결해 보기

---

## 📁 폴더 구조

```text
261022_GitHub 실습/
├── 📄 index.html          # 화면 뼈대
├── 📂 css/
│   └── style.css          # 디자인
├── 📂 js/
│   ├── logic.js           # 계산 로직
│   ├── ui.js              # 화면 그리기
│   └── main.js            # 이벤트 · 저장 · 전체 흐름
└── 📄 README.md
```

> 🧩 **역할 분리**  
> `logic.js`(계산) → `ui.js`(표시) → `main.js`(연결) 순서로 불러온다.

---

## ▶️ 실행 방법

**웹페이지 (브라우저 필요)**

1. VS Code에서 폴더 열기
2. **Live Server** 확장 설치
3. `index.html` 우클릭 → **Open with Live Server**

**계산만 하는 JS 파일 (Node.js)**

```bash
node js/logic.js
```

> ⚠️ `document`, `window`, `localStorage`를 쓰는 파일은 Node.js가 아니라 브라우저에서 실행해야 한다.

---

## 🧠 배운 것 정리

<details>
<summary><b>🔍 에러 메시지 읽는 법</b></summary>

| 에러 | 의미 | 해결 |
|---|---|---|
| `Cannot find module` | 파일 위치가 다름 | 올바른 폴더로 `cd` 후 실행 |
| `Unexpected end of input` | 중괄호 `}` 부족 | 괄호 짝 확인 |
| `window is not defined` | 브라우저 코드를 Node로 실행 | Live Server로 실행 |
| `xxx is not defined` | 다른 파일 함수를 못 찾음 | 내보내기 · 불러오기 순서 확인 |

</details>

<details>
<summary><b>🛠️ F5가 안 될 때</b></summary>

- F5는 Node.js로 한 파일을 단독 실행한다.
- 여러 파일이 같이 움직이는 웹페이지는 `index.html`을 브라우저로 열어야 한다.

</details>

<details>
<summary><b>🤖 AI와 일하는 팁</b></summary>

- 에러 메시지는 **전체를 그대로** 붙여서 질문하기
- 하고 싶은 일을 **주석으로 먼저** 설명하기
- AI가 짠 코드도 **직접 실행해서 확인**하기

</details>

---

## 🧰 사용 도구

| 구분 | 도구 |
|---|---|
| 에디터 | Visual Studio Code |
| AI 코딩 | Claude Code, GitHub Copilot |
| 런타임 | Node.js |
| 버전 관리 | Git, GitHub |
| 미리보기 | Live Server |

---

## 📌 앞으로 해 보고 싶은 것

- [ ] 실습 결과를 **GitHub Pages**로 배포
- [ ] 업무 자동화에 AI 도구 적용
- [ ] 꾸준히 커밋하며 학습 기록 쌓기

---

<div align="center">

**🌱 Learning in public · 배운 건 기록으로 남긴다**

`2026.10.22 ~ 2026.10.23` · LG화학 K-뉴딜 아카데미

</div>
