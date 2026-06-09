# PDF MAS (PDF Management & Automation System)

Flask REST API + React 기반 PDF 병합 / 분할 / 북마크 관리 웹 서비스

## 프로젝트 정보

- 개발 기간: 2026
- 개발 인원: 1인 (협업 : 배관부서)
- 주요 기술: Flask, React, PyPDF, PyMuPDF, Docker, GitHub Actions

- GitHub
  - https://github.com/yunniku/flask-PDF-Merge-Split

- 배포
  - https://miraculous-love-production-f9db.up.railway.app

---

## 1. 프로젝트 개요
도요엔지니어링코리아 기술본부에서 배관 도면(ISO), 시공 문서를 다루는 과정에서 PDF 병합·분할·도면 추출 작업이 반복됐습니다. 기존 Adobe Acrobat 수작업 방식은 도면 100장 기준 30분 이상 소요되는 경우도 있었습니다.

이를 해결하기 위해 먼저 PyQt6 데스크탑 프로그램을 만들어 사내에 적용했고, 이후 설치 없이 브라우저에서 바로 쓸 수 있도록 Flask REST API + React 기반 웹 서비스로 전환했습니다.

기존 데스크탑에서 검증된 PyPDF / PyMuPDF 처리 로직을 그대로 백엔드로 이식하고, React를 통해 파일 드래그앤드롭, 순서 변경, 선택 기반 처리 기능을 구현하여 웹 환경에서도 동일한 사용성을 유지하도록 설계했습니다.

## 2. 기술 스택
| 분류 | 기술 | 선택 이유 |
|------|------|-----------|
| Backend | Flask | REST API 기반 구조 설계 및 PDF 처리 로직 구현 |
| Frontend | React | 파일 업로드, 드래그앤드롭, 비동기 UI 처리 구현 |
| PDF 처리 (조작) | PyPDF | PDF 병합, 분할 등 문서 구조 변경 작업 처리 |
| PDF 처리 (분석) | PyMuPDF | 텍스트 추출 및 좌표 기반 필드 데이터 분석 |
| Excel 생성 | openpyxl | 북마크 추출 결과를 xlsx 파일로 저장 |
| Infra | Docker, Docker Compose | 서비스 컨테이너화 및 환경 통일 |
| Web Server | Nginx | 리버스 프록시 및 API 라우팅 처리 |
| CI/CD | GitHub Actions | 자동 배포 파이프라인 구성 |
| Deploy | Railway / AWS EC2 | 서비스 배포 및 인프라 운영 경험 |

---

## 3. 주요 기능

### 3-1. PDF 병합
- 여러 PDF 파일을 하나로 병합
- 드래그앤드롭으로 병합 순서 변경
- 선택 파일 개별 삭제

### 3-2. PDF 분할 (4가지 방식)
- 페이지 범위 분할 — 시작/끝 페이지 직접 입력해서 추출
- 북마크 기준 분할 — 북마크 단위로 자동 분할
- 단일 페이지 분할 — 페이지 한 장씩 개별 파일로 분리
- 필드 기반 분할 — PDF 내 SUB_ID / MODULE / ISO 필드를 PyMuPDF로 읽어 자동 파일명 생성 후 분할 (실무 도면 관리용 핵심 기능)

### 3-3. 북마크 추출
- PDF 북마크 목록 추출
- Excel 파일로 저장

### 3-4. 공통 기능
- 체크박스로 결과 파일 개별 선택
- 선택 항목만 다운로드
- 반응형 UI 지원 (PC / 모바일)

## 4. 시스템 구조
Flask를 REST API 서버로 구성하고, React를 독립적인 SPA 프론트엔드로 분리하여 역할을 명확하게 구분했습니다.

사용자의 요청은 React 컴포넌트에서 fetch API를 통해 전달되며, Flask는 PyPDF / PyMuPDF로 파일을 처리한 뒤 다운로드 URL을 JSON으로 반환합니다.

```
Frontend (React)
├── Home              기능 선택 메인 화면
├── Merge             파일 선택 + 드래그 순서 변경 + 병합
├── Split Hub         분할 방식 선택 화면
│   ├── SplitRange        페이지 범위 분할
│   ├── BookmarkSplit     북마크 기준 분할
│   ├── SplitSingle       단일 페이지 분할
│   └── SplitFields       필드 기반 분할 (실무 핵심)
└── BookmarkExtract   북마크 추출 → Excel 저장

        │  fetch POST (FormData)
        ↓

Backend (Flask)
├── /api/merge              PDF 병합       → PyPDF
├── /api/split              페이지 범위 분할 → PyPDF
├── /api/bookmark-split     북마크 기준 분할 → PyMuPDF
├── /api/split-single       단일 페이지 분할 → PyPDF
├── /api/split-fields       필드 기반 분할  → PyMuPDF (좌표 기반 텍스트 추출)
└── /api/bookmark-extract   북마크 추출     → PyMuPDF → openpyxl

        │  파일 저장 / 읽기
        ↓

Storage
└── uploads/    업로드 파일 + 처리 결과 임시 저장
```

### 4-1. 데이터 흐름
사용자 → PDF 파일 선택
  → React: fetch POST (FormData) 로 Flask 전송
    → Flask: PyPDF / PyMuPDF로 처리
      → uploads/ 저장 → download_url 반환 (JSON)
        → React: 다운로드 링크 표시
          → 사용자 파일 다운로드

### 4-2. 구조 설계 핵심 포인트
- 프론트엔드와 백엔드를 완전히 분리한 구조
- Flask는 UI 없이 REST API 서버 역할만 수행
- PDF 처리 로직은 기존 PyQt 데스크탑 버전에서 재사용
- PyPDF / PyMuPDF를 기능 기준으로 역할 분리하여 안정성 확보

---

## 5. 핵심 구현 포인트

### 5-1. 필드 기반 분할 (실무 자동화 핵심 로직)
실무에서 반복적으로 수행되던 도면 PDF 분할 작업을 자동화한 기능입니다. 기존에는 도면 내 SUB_ID, MODULE, ISO 필드 정보를 직접 확인하고 파일을 수동으로 분리해야 했습니다.

PyMuPDF를 활용하여 PDF 페이지 내 좌표 기반 텍스트를 추출하고, 특정 필드 값을 파싱하여 파일명을 자동 생성한 뒤 분할하도록 구현했습니다. PyQt GUI에서 구현 후 Flask REST API 구조로 이식하여 웹 환경에서도 동일하게 동작하도록 설계했습니다.

```python
import fitz  # PyMuPDF

doc = fitz.open(pdf_path)

for page in doc:
    blocks = page.get_text("blocks")

    for block in blocks:
        # SUB_ID / MODULE / ISO 등 필드 값 추출
        field_value = parse_field(block[4])

        # 필드 기반 파일명 생성 및 분할 처리
```

---

### 5-2. React FormData 기반 파일 업로드 및 비동기 처리
PDF 파일은 일반 JSON 방식으로는 서버에 전송할 수 없기 때문에 FormData를 활용한 파일 업로드 구조로 설계했습니다.

React에서는 fetch API를 사용하여 FormData에 파일을 담아 전송하고, Flask에서는 request.files를 통해 업로드된 파일을 수신합니다.

```javascript
// React: FormData 기반 파일 업로드
const formData = new FormData()
formData.append('files', file)

const res = await fetch('/api/merge', {
  method: 'POST',
  body: formData
})

const data = await res.json()
// 다운로드 URL 반환 및 화면 표시
```

```python
# Flask: 업로드 파일 수신 및 처리
@merge_bp.route('/api/merge', methods=['POST'])
def merge_pdfs():
    files = request.files.getlist('files')

    merger = PdfMerger()
    for f in files:
        merger.append(f)

    return jsonify({"download_url": result_url})
```

---

### 5-3. Docker 기반 배포 및 GitHub Actions CI/CD 자동화
로컬(macOS) 개발 환경에서 Docker를 활용해 애플리케이션을 컨테이너화하고, 운영 환경과 동일한 실행 구조를 구성했습니다.

GitHub Actions를 활용하여 main 브랜치에 push가 발생하면 EC2 서버로 자동 배포되도록 CI/CD 파이프라인을 구축했습니다.

```
git push (main)
  → GitHub Actions 실행
    → EC2 SSH 접속
      → git pull → docker-compose up --build -d
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
          key: ${{ secrets.EC2_KEY }}
          script: |
            cd ~/flask-PDF-Merge-Split
            git pull origin main
            docker-compose up --build -d
```

---

## 6. 배포 구조
git push → Railway 자동 배포
├── Backend  → Railway 서비스 (Flask)
├── Frontend → Railway 서비스 (React + Nginx)
└── 환경변수 기반 설정 관리

로컬 환경(개발) - Flask와 React를 분리하여 실행
배포 환경 - Backend / Frontend 각각 Railway 서비스로 분리 배포
Docker 기반 EC2 환경에서 Nginx 리버스 프록시 + GitHub Actions 자동 배포 파이프라인을 직접 구축하여 인프라 운영 경험을 쌓았습니다.

---

## 7. AI 활용 내역
본 프로젝트는 AI(Claude, ChatGPT)를 개발 보조 도구로 사용했습니다.
문제 원인 분석, 코드 리뷰, 학습 보조 용도로 AI를 활용했으며 최종 설계, 구현, 디버깅은 직접 수행했습니다.

### 직접 설계 및 구현
- 실무 도면 PDF에서 SUB_ID / MODULE / ISO 필드 추출 로직 (PyMuPDF 좌표 기반)
- PyPDF / PyMuPDF 역할 분리 설계 (구조 변경 vs 분석 처리)
- Flask Blueprint 기반 API 구조 설계
- React FormData 파일 업로드 및 다운로드 URL 반환 흐름 구현
- Docker Compose 기반 (Flask + React + Nginx) 컨테이너 구성
- GitHub Actions CI/CD 파이프라인 구축 (EC2 자동 배포)
- Railway 분리 배포 설정

### AI 보조 활용
- docker-compose 컨테이너 간 네트워크 연결 오류 원인 파악
- Nginx 리버스 프록시 설정 (/api/ 경로 라우팅) 검토
- GitHub Actions SSH 배포 스크립트 구성 보조
- CORS 이슈 디버깅 방향 검토
- README 초안 작성 및 문서 구조 개선

---
