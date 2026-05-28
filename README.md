# 📄 PDF MAS — PDF 관리 시스템

> React + Flask 기반의 PDF 병합, 분할, 북마크 관리 웹 서비스

🔗 **배포 링크**: [https://miraculous-love-production-f9db.up.railway.app](https://miraculous-love-production-f9db.up.railway.app)

---

## 📌 프로젝트 소개

**PDF MAS**는 PDF 병합, 분할, 북마크 관리 기능을 제공하는 PDF 관리 시스템입니다.

실무에서 배관 도면, ISO 도면, 시공 문서 등을 관리할 때 여러 PDF를 하나로 합치거나 특정 도면만 분리해야 하는 작업이 자주 발생했습니다. 기존에는 Adobe Acrobat으로 수작업 처리해야 해서 시간이 많이 소요됐습니다.

이를 해결하기 위해 Python과 PyQt6로 데스크탑 프로그램을 먼저 개발했고, 이후 설치 없이 브라우저에서 바로 사용할 수 있도록 **React + Flask 기반 웹 서비스로 확장**했습니다.

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **Frontend** | React, React Router, JavaScript, CSS |
| **Backend** | Python 3.11, Flask, Flask-CORS |
| **PDF 처리** | PyPDF, PyMuPDF (fitz) |
| **Excel 처리** | openpyxl, xlsx (프론트) |
| **배포** | Railway |

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
├── Home          기능 선택 메인 화면
├── Merge         파일 선택 + 드래그 순서 변경 + 병합
├── Split Hub     분할 방식 선택 화면
│   ├── SplitRange      페이지 범위 분할
│   ├── BookmarkSplit   북마크 기준 분할
│   ├── SplitSingle     단일 페이지 분할
│   └── SplitFields     필드 기반 분할
└── BookmarkExtract     북마크 추출 → Excel 저장

         │  fetch (REST API / JSON)
         ↓

Backend (Flask)
├── /api/merge              PDF 병합
├── /api/split              페이지 범위 분할
├── /api/bookmark-split     북마크 기준 분할
├── /api/split-single       단일 페이지 분할
├── /api/split-fields       필드 기반 분할
└── /api/bookmark-extract   북마크 추출 → Excel

         │  파일 저장/읽기
         ↓

Storage
└── uploads/    업로드 파일 + 처리 결과 저장
```

---

## 📁 프로젝트 구조

```
2. PDF_MAS/
├── backend/                      Flask API 서버
│   ├── app.py                    Flask 앱 생성 + Blueprint 등록 + CORS
│   ├── requirements.txt          Python 패키지 목록
│   ├── Procfile                  Railway 배포 설정
│   ├── routes/                   API 라우트 모음
│   │   ├── merge.py              /api/merge
│   │   ├── split.py              /api/split
│   │   ├── bookmark_split.py     /api/bookmark-split
│   │   ├── split_single.py       /api/split-single
│   │   ├── split_fields.py       /api/split-fields
│   │   └── bookmark_extract.py   /api/bookmark-extract
│   └── uploads/                  업로드/결과 파일 저장
│
└── frontend/                     React 앱
    ├── package.json
    ├── .nvmrc                    Node 버전 고정 (20)
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
  ↓ 브라우저에서 파일 선택
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

## 🚀 로컬 실행 방법

### Backend

```bash
# 1. 백엔드 폴더로 이동
cd backend

# 2. 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate

# 3. 패키지 설치
pip3 install -r requirements.txt

# 4. 서버 실행
python3 app.py
# → http://localhost:5000
```

### Frontend

```bash
# 1. 프론트엔드 폴더로 이동
cd frontend

# 2. 패키지 설치
npm install

# 3. 서버 실행
npm start
# → http://localhost:3000
```

---

## 🚀 배포

```
git push → Railway 자동 배포
├── Backend  → flask-pdf-merge-split-production.up.railway.app
└── Frontend → miraculous-love-production-f9db.up.railway.app
```

---

## 👨‍💻 개발자

| 항목 | 내용 |
|------|------|
| **개발 기간** | 2026 |
| **개발 인원** | 1인 개발 |
| **버전** | Ver 1.0 |
