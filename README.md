# 📄 PDF MAS — PDF 관리 시스템

> React + Flask 기반의 PDF 병합, 분할, 북마크 관리 웹 서비스

🔗 **배포 링크**: [https://miraculous-love-production-f9db.up.railway.app](https://miraculous-love-production-f9db.up.railway.app)

---

## 📌 프로젝트 소개

**PDF MAS**는 PDF 병합, 분할, 북마크 관리 기능을 제공하는 PDF 관리 시스템입니다.

실무에서 배관 도면, ISO 도면, 시공 문서 등을 관리할 때 여러 PDF를 하나로 합치거나 특정 도면만 분리해야 하는 작업이 자주 발생했습니다. 기존에는 Adobe Acrobat으로 수작업 처리해야 해서 시간이 많이 소요됐습니다.

이를 해결하기 위해 Python과 PyQt6로 데스크탑 프로그램을 먼저 개발했고,
이후 설치 없이 브라우저에서 바로 사용할 수 있도록 **React + Flask 기반 웹 서비스로 확장**했습니다.

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **Frontend** | React, React Router, JavaScript, CSS |
| **Backend** | Python 3.11, Flask, Flask-CORS |
| **PDF 처리** | PyPDF, PyMuPDF (fitz) |
| **Excel 처리** | openpyxl, xlsx (프론트) |
| **컨테이너** | Docker, Docker Compose |
| **웹 서버** | Nginx (리버스 프록시) |
| **배포 (서비스)** | Railway |
| **배포 (인프라)** | AWS EC2 (Amazon Linux 2023) |
| **CI/CD** | GitHub Actions |

---

## ✨ 주요 기능

### PDF 병합
- 여러 PDF 파일 선택 후 하나로 병합
- 드래그 앤 드롭으로 병합 순서 변경
- 파일 개별 삭제 가능

### PDF 분할
- **페이지 범위 분할** — 원하는 페이지 범위만 추출
- **북마크 기준 분할** — 북마크 단위로 자동 분할
- **단일 페이지 분할** — 페이지 한 장씩 개별 파일로 분리
- **필드 기반 분할** — SUB_ID / MODULE / ISO 필드를 읽어 자동 파일명 생성 후 분할

### 북마크 추출
- PDF 북마크 목록 추출
- Excel 파일로 저장

### 공통 기능
- 분할 결과 체크박스로 개별 선택
- 선택 항목만 Excel로 내보내기
- 반응형 디자인 (모바일 / PC 대응)

---

## 🏗 아키텍처

```
Frontend (React)
├── Home              기능 선택 메인 화면
├── Merge             파일 선택 + 드래그 순서 변경 + 병합
├── Split Hub         분할 방식 선택 화면
│   ├── SplitRange        페이지 범위 분할
│   ├── BookmarkSplit     북마크 기준 분할
│   ├── SplitSingle       단일 페이지 분할
│   └── SplitFields       필드 기반 분할
└── BookmarkExtract   북마크 추출 → Excel 저장

         │  fetch (REST API / JSON)
         ↓

Backend (Flask)
├── /api/merge              PDF 병합
├── /api/split              페이지 범위 분할
├── /api/bookmark-split     북마크 기준 분할
├── /api/split-single       단일 페이지 분할
├── /api/split-fields       필드 기반 분할
└── /api/bookmark-extract   북마크 추출 → Excel

         │  파일 저장 / 읽기
         ↓

Storage
└── uploads/    업로드 파일 + 처리 결과 저장
```

---

## 📁 프로젝트 구조

```
PDF_MAS/
├── .github/
│   └── workflows/
│       └── deploy.yml            GitHub Actions CI/CD
├── backend/                      Flask API 서버
│   ├── app.py                    Flask 앱 생성 + Blueprint 등록 + CORS
│   ├── requirements.txt          Python 패키지 목록
│   ├── Procfile                  Railway 배포 설정
│   ├── Dockerfile                Docker 이미지 빌드 설정
│   ├── routes/                   API 라우트 모음
│   │   ├── merge.py              /api/merge
│   │   ├── split.py              /api/split
│   │   ├── bookmark_split.py     /api/bookmark-split
│   │   ├── split_single.py       /api/split-single
│   │   ├── split_fields.py       /api/split-fields
│   │   └── bookmark_extract.py   /api/bookmark-extract
│   └── uploads/                  업로드 / 결과 파일 저장
│
└── frontend/                     React 앱
    ├── package.json
    ├── .nvmrc                    Node 버전 고정 (20)
    ├── Dockerfile                Docker 이미지 빌드 설정
    ├── nginx.conf                Nginx 리버스 프록시 설정
    └── src/
        ├── App.js                라우터
        ├── api/
        │   └── pdfApi.js         Flask API 호출 함수 모음
        └── pages/
            ├── js/               페이지 컴포넌트
            └── css/              스타일 파일
```

---

## 📊 데이터 흐름

```
사용자
  ↓ 브라우저에서 PDF 파일 선택
React (Frontend)
  ↓ fetch POST (FormData)
Flask API (Backend)
  ↓ PDF 처리 (PyPDF / PyMuPDF)
uploads/ 폴더 저장
  ↓ download_url 반환 (JSON)
React에서 다운로드 링크 표시
  ↓
사용자 파일 다운로드
```

---

## 🚀 설치 방법

### 사전 요구사항

- Python 3.11 이상
- Node.js 20 이상 (`.nvmrc` 기준)
- pip3, npm
- Docker / Docker Compose (Docker 실행 시)

### 방법 1 — 로컬 직접 실행

#### 1. 레포지토리 클론

```bash
git clone https://github.com/yunniku/flask-PDF-Merge-Split.git
cd flask-PDF-Merge-Split
```

#### 2. Backend 실행

```bash
# 백엔드 폴더로 이동
cd backend

# 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate

# 패키지 설치
pip3 install -r requirements.txt

# 서버 실행
python3 app.py
# → http://localhost:5000
```

#### 3. Frontend 실행 (별도 터미널)

```bash
# 프론트엔드 폴더로 이동
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm start
# → http://localhost:3000
```

> 브라우저에서 `http://localhost:3000` 접속

---

### 방법 2 — Docker로 실행 (환경 통일)

```bash
# 프로젝트 루트에서 한 번에 실행
docker-compose up --build
# → http://localhost

# 백그라운드 실행
docker-compose up -d --build

# 종료
docker-compose down
```

> Docker 실행 시 Frontend(Nginx) + Backend(Flask) 컨테이너가 함께 올라옵니다.

---

## 📖 사용법

### PDF 병합
1. 상단 메뉴에서 **PDF 병합** 선택
2. PDF 파일 2개 이상 선택
3. 드래그 앤 드롭으로 순서 조정, 필요 없는 파일은 개별 삭제
4. **병합** 버튼 클릭 → 결과 파일 다운로드

### PDF 분할
1. 상단 메뉴에서 **PDF 분할** 선택
2. 분할 방식 선택:
   - **페이지 범위** — 시작/끝 페이지 직접 입력
   - **북마크 기준** — 북마크 단위로 자동 분할
   - **단일 페이지** — 페이지 한 장씩 개별 파일
   - **필드 기반** — SUB_ID / MODULE / ISO 필드 자동 인식 후 분할
3. PDF 파일 업로드 후 분할 실행
4. 결과 목록에서 체크박스로 원하는 파일 선택
5. **다운로드** 또는 **Excel로 내보내기** 클릭

### 북마크 추출
1. 상단 메뉴에서 **북마크 추출** 선택
2. PDF 파일 업로드
3. 추출된 북마크 목록 확인
4. **Excel로 저장** 클릭

---

## 🚀 배포 구조

### Railway (서비스 운영)
HTTPS 지원 및 안정적인 서비스 운영을 위해 사용

```
git push → Railway 자동 배포
├── Backend  → flask-pdf-merge-split-production.up.railway.app
└── Frontend → miraculous-love-production-f9db.up.railway.app
```

### AWS EC2 + Docker + GitHub Actions (CI/CD 인프라 경험)
macOS 로컬에서 개발 후 Docker로 컨테이너화, AWS EC2에 배포
GitHub Actions CI/CD 파이프라인으로 `git push` 한 번에 자동 배포

```
git push (main)
  → GitHub Actions 실행
    → EC2 SSH 접속
      → git pull
        → docker-compose up --build -d
```

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: EC2 배포
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_KEY }}
          script: |
            cd ~/flask-PDF-Merge-Split
            git pull origin main
            docker-compose up --build -d
```

---

## 🤝 기여 방법

1. 이 레포를 **Fork** 하세요
2. 새 브랜치를 생성하세요
   ```bash
   git checkout -b feature/새기능
   ```
3. 변경사항을 커밋하세요
   ```bash
   git commit -m "feat: 새 기능 추가"
   ```
4. 브랜치에 Push 하세요
   ```bash
   git push origin feature/새기능
   ```
5. **Pull Request**를 열어주세요

---

## 👨‍💻 개발자

| 항목 | 내용 |
|------|------|
| **개발 기간** | 2026 |
| **개발 인원** | 1인 개발 |
| **버전** | Ver 1.0 |
| **GitHub** | [yunniku](https://github.com/yunniku) |
