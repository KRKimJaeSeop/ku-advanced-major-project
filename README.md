# 살펴봄 (Salpyeobom) 🏠

> AI 돌봄 에이전트 (AI Care Agent)  
> 딥러닝 기반 이상 탐지와 LLM을 결합한 독거노인 모니터링 시스템

**건국대학교 전공심화프로젝트(종합설계) | 3243-002 | 정갑주 교수님**

[![Tests](https://img.shields.io/badge/Tests-85%20passed-success)](https://github.com/greenrain78/salpyeobom-backend)
[![Coverage](https://img.shields.io/badge/Coverage-98.57%25-brightgreen)](https://github.com/greenrain78/salpyeobom-backend)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)](https://fastapi.tiangolo.com/)

---

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [설치 및 실행](#설치-및-실행)
- [성능 지표](#성능-지표)
- [프로젝트 구조](#프로젝트-구조)
- [테스트](#테스트)
- [팀원 소개](#팀원-소개)
- [참고 문서](#참고-문서)

---

## 🎯 프로젝트 개요

### 문제 정의

독거노인 돌봄 환경에서 기존 임계값 기반 IoT 센서는 개인의 생활 패턴 차이를 반영하지 못해 높은 오탐지(False Positive)를 발생시킵니다. 이로 인해 인력 낭비 및 위기 상황(고독사, 낙상 등) 발견에 평균 3~7일이 소요되는 한계가 존재합니다.

### 해결 방안

**1. 이상 패턴 정밀 탐지**
- Attention RNN 모델을 적용하여 집단 기준의 30일 윈도우 생활 패턴 학습
- 1시간 주기 실시간 이상 패턴 탐지

**2. 대시보드 반영 및 자동화 보고**
- 탐지된 MAE 이상치 데이터를 PostgreSQL DB에 즉각 반영
- LLM API로 자연어 형태의 판정 근거 리포트 생성
- 복지사 이메일 및 대시보드로 실시간 전송

### 제공 가치

데이터 기반의 객관적인 위험도 분류를 통해 복지사가 다수의 독거노인을 효율적으로 관리하고, 위기 상황을 놓치지 않도록 모니터링 업무를 보조합니다.

---

## ⚡ 주요 기능

### 1. 듀얼 트랙 AI 모델 (Dual-Track)
- **Track A (Global)**: 집단 기준 30일 윈도우 오토인코더 학습
- **Track B (Personal)**: 개인 과거 패턴 기반 파인튜닝
- **교차 검증**: 두 트랙의 MAE 점수가 각각 임계값(95th percentile) 초과 시 '초고위험' 판정
- **오탐 제어**: 집단+개인 패턴을 동시 고려하여 높은 오탐률 문제 해결

### 2. 어텐션 메커니즘
- **Sequence Attention**: 30일 윈도우 중 어느 날짜에 집중할지 가중치 학습
- **이상 판단 근거**: MAE 기반 이상 점수 산출
- **향후 예정**: Hourly Attention(시간대별), Temporal Attention(날짜별) 세분화

### 3. 실시간 1시간 주기 추론
- **데이터 수집**: 리본케어 센서를 통한 다중 변수(활동, 수면, 욕실, 외출, 환경) 수집
- **슬라이딩 윈도우**: 1시간 단위 실시간 업데이트
- **즉각 대응**: 낙상 및 급성 응급 상황 발생 시 1시간 이내 감지

### 4. 복지사 대시보드
- **위험도 분류**: 정상/주의/초고위험 레벨 실시간 모니터링
- **이상 알림**: 이상 감지 시 대시보드 즉각 반영
- **향후 예정**: 2D 히트맵, 일별 중요도 Bar Chart, 이메일 알림

---

## 🛠 기술 스택

### Backend
- **FastAPI** - REST API 서버
- **PostgreSQL** - 메인 데이터베이스
- **Tortoise ORM** - 비동기 ORM
- **SQLite** - 테스트 환경 (in-memory)
- **pytest** - 테스트 프레임워크 (85개 테스트, 98.57% 커버리지)

### AI/ML
- **PyTorch 2.10** - 딥러닝 프레임워크
- **Attention RNN** - 시계열 이상 감지 모델
- **scikit-learn** - 전처리 및 평가
- **NumPy, Pandas** - 데이터 처리

### Frontend
- **React.js** - 사용자 인터페이스
- **Chart.js** - 데이터 시각화
- **Tailwind CSS** - 스타일링

### Infrastructure
- **Docker** - 컨테이너화
- **Google Colab** - 모델 학습 환경
- **GitHub Actions** - CI/CD

### Development Tools
- **Claude AI (Anthropic)** - 개발 가속화 (70% 시간 단축)
- **Git, SourceTree** - 버전 관리
- **Postman** - API 테스트 (19 requests)

---

## 🏗 시스템 아키텍처

```
┌─────────────────────┐
│ 리본케어 IoT 센서   │
│ - PIR 센서          │
│ - 온습도, 조도      │
└──────┬──────────────┘
       │ 1시간 단위 실시간 스트리밍
       ▼
┌─────────────────────┐
│ 데이터 수집 레이어  │
│ - PostgreSQL 저장   │
│ - 다중 변수 수집    │
│   (활동/수면/욕실/  │
│    외출/환경)       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ 전처리 파이프라인   │
│ - 30일 슬라이딩     │
│   윈도우            │
│ - MinMaxScaler      │
│ - 16개 특징 추출    │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────────┐
│ AI 분석 레이어 (듀얼 트랙)   │
│ ┌──────────┐  ┌───────────┐  │
│ │ Track A  │  │ Track B   │  │
│ │ (Global) │  │ (Personal)│  │
│ │ 집단 기준│  │ 개인 과거 │  │
│ │ 30일     │  │ 30일      │  │
│ └────┬─────┘  └─────┬─────┘  │
│      │               │        │
│      └───────┬───────┘        │
│              ▼                │
│      교차 검증 (MAE)          │
│      95th percentile 임계값   │
└──────┬───────────────────────┘
       │
       ▼
┌─────────────────────┐
│ 서비스 레이어       │
│ - REST API (9개)    │
│ - DB 연동 (1시간)   │
│ - situations 테이블 │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────┐
│ 복지사 대시보드              │
│ - 실시간 위험도 모니터링     │
│   (정상/주의/초고위험)       │
│ - 2D 히트맵 (7일×24시간)     │
│ - 일별 중요도 Bar Chart      │
│ - 이메일 알림                │
└─────────────────────────────┘
```

---

## 📦 설치 및 실행

### 필수 요구사항

- Python 3.11 이상
- PostgreSQL 15 이상
- Node.js 18 이상 (프론트엔드)
- Docker (선택사항)

### 1. 저장소 클론

```bash
git clone https://github.com/greenrain78/salpyeobom-backend.git
cd salpyeobom-backend
```

### 2. 백엔드 설정

```bash
# Python 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일 수정 (DATABASE_URL, SECRET_KEY 등)
```

### 3. 데이터베이스 초기화

```bash
# PostgreSQL 실행 (Docker 사용 시)
docker-compose up -d postgres

# 테이블 생성 및 마이그레이션
python scripts/init_db.py
```

### 4. 백엔드 실행

```bash
# 개발 모드
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 또는 Makefile 사용
make dev
```

**API 문서**: http://salpyeobom.kro.kr:8000/docs

### 5. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

**프론트엔드**: 대원님 합치는작업 끝나시면 수정 예정

### 6. 전체 시스템 실행 (Docker Compose)

```bash
docker-compose up -d
```

---

## 📊 성능 지표

### AI 모델 성능 (완전히 새로운 환자 테스트 / SET7~8)

| 지표 | 값 | 설명 |
|------|-----|------|
| **Precision** | **97.56%** | 이상 알림 중 97.56%가 실제 이상 |
| **Recall** | **100%** ⭐ | 응급/사망을 100% 감지 (0% 놓침) |
| **F1 Score** | **98.77%** | 거의 완벽한 균형 |
| **오탐률** | **5.0%** | 평소 300건 중 15건만 오탐 |
| **False Negative** | **0건** ⭐ | 생명 위협 상황 단 한 건도 놓치지 않음 |

> 듀얼 트랙 도입으로 단일 모델 대비 오탐률 6.9% → 5.0% 감소

### 백엔드 테스트 결과

| 항목 | 결과 |
|------|------|
| **총 테스트 케이스** | 85개 |
| **통과 / 실패** | 85 / 0 ✅ |
| **코드 커버리지** | **98.57%** (490 stmts / 7 miss) |
| **API 엔드포인트** | 9개 (모두 성공/실패 케이스 보유) |
| **UAT 시나리오** | 3개 (모두 PASS) |
| **발견 버그** | 4건 (모두 GitHub Issue closed) |
| **실행 시간** | 15.03s (SQLite in-memory) |

### 데이터셋

- **학습**: 30명 × 60일 (1,800행)
- **테스트**: 10명 × 60일 (600행)
- **총 환자**: 40명
- **파트너**: 리본케어 (실제 센서 데이터 제공)

---

## 📂 프로젝트 구조

```
salpyeobom/
├── app/                       # FastAPI 애플리케이션
│   ├── core/                  # 핵심 설정
│   │   ├── config.py          # 환경 변수 설정
│   │   ├── security.py        # 인증 (JWT, bcrypt)
│   │   ├── dependencies.py    # FastAPI 의존성
│   │   └── exceptions.py      # 커스텀 예외
│   ├── models/                # Tortoise ORM 모델
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── adl_raw.py
│   │   └── situation.py
│   ├── schemas/               # Pydantic 스키마
│   │   ├── auth.py
│   │   ├── patient_monitoring.py
│   │   ├── adl_raw.py
│   │   └── situation.py
│   ├── routers/               # API 라우터 (9개 엔드포인트)
│   │   ├── auth.py            # POST /register, /login, GET /me
│   │   ├── dashboard.py       # GET /summary
│   │   ├── patients.py        # GET /, /{id}/details
│   │   ├── situations.py      # GET /active
│   │   └── adl_raw.py         # GET /, /{id}
│   ├── services/              # 비즈니스 로직
│   │   └── adl_raw_transform.py  # 시계열 변환 함수
│   ├── database.py            # DB 초기화
│   └── main.py                # FastAPI 앱 진입점
├── tests/                     # 테스트 (85개, 98.57% 커버리지)
│   ├── test_auth.py
│   ├── test_dashboard.py
│   ├── test_patients.py
│   ├── test_situations.py
│   ├── test_adl_raw.py
│   ├── test_uat_scenarios.py  # UAT 시나리오 3개
│   └── conftest.py            # pytest 설정
├── ml/                        # AI 모델
│   ├── models/                # 학습된 모델 (.pth)
│   ├── notebooks/             # Jupyter 노트북
│   ├── preprocessing/         # 전처리 파이프라인
│   └── train.py               # 학습 스크립트
├── frontend/                  # React 프론트엔드
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   ├── pages/             # 페이지
│   │   └── utils/             # 유틸리티
│   └── package.json
├── docs/                      # 문서
│   ├── test/                  # 테스트 문서
│   │   ├── postman_collection.json  # Postman 19 requests
│   │   └── bug_tracking.md    # 버그 트래킹
│   ├── planning.md
│   ├── requirements.md
│   └── design.md
├── scripts/                   # 유틸리티 스크립트
│   └── init_db.py             # DB 초기화
├── docker-compose.yml         # Docker 구성
├── requirements.txt           # Python 의존성
├── pyproject.toml             # pytest 설정
├── Makefile                   # 단축 명령
└── README.md                  # 본 문서
```

---

## 🧪 테스트

### 테스트 실행

```bash
# 전체 테스트 실행
make test

# 또는
pytest

# 커버리지 포함
pytest --cov=app --cov-report=html
```

### 테스트 구성

| 카테고리 | 개수 | 설명 |
|---------|------|------|
| **단위 테스트** | 32개 | 비즈니스 로직 함수 테스트 |
| **API 테스트** | 50개 | 9개 엔드포인트 × 성공/실패 케이스 |
| **UAT 시나리오** | 3개 | 사용자 여정 테스트 |
| **총계** | **85개** | 98.57% 코드 커버리지 |

### Postman Collection

API 테스트용 Postman Collection 제공:

```bash
# Postman에서 Import
docs/test/postman_collection.json

# 19개 requests
# - 9개 엔드포인트
# - 성공/실패 케이스
# - 자동 토큰 캡처
```

### CI/CD

- **GitHub Actions**: PR 시 자동 테스트
- **커버리지 게이트**: 70% 이상 강제
- **테스트 결과**: 15.03초 내 완료

---

## 👥 팀원 소개

### 9팀 (건국대학교 전공심화프로젝트)

| 이름 | 역할 | 담당 업무 |
|------|------|-----------|
| **김재섭**<br>(202415181) | AI 개발 / 팀장 | 듀얼 트랙 Attention RNN 모델 설계 및 구현(PyTorch), 리본케어 데이터 전처리 파이프라인 구축(16개 특징 추출), MAE 기반 교차 검증 이상 감지 알고리즘 개발, 모델 성능 평가 및 검증(F1: 98.77%), LLM 활용 개발 가속화 및 프로젝트 총괄 |
| **김대원**<br>(202011256) | 백엔드 / DB / 아키텍처 | 시스템 아키텍처 및 DB 스키마 설계(FastAPI · PostgreSQL · Tortoise ORM), 인증·REST API 엔드포인트 구현, 데이터 시드 파이프라인 구축, 백엔드 테스트 자동화 및 통합 테스트 보고서 작성(85개 테스트, 98.57% 커버리지) |
| **이지민**<br>(202415202) | 백엔드 / AI 파이프라인 | 기업체 샘플 데이터 기반 가상 데이터 생성, 데이터 전처리 및 학습, Attention RNN 모델 구현, PostgreSQL 비동기 연동, 1시간 주기 실시간 데이터 스트리밍 수신, sliding window 텐서 적재 및 AI 모델 추론 API 파이프라인 스크립트 완성, 복지사 대시보드 앱과 연결 |
| **윤아림**<br>(202415198) | PM / 문서 | 프로젝트 요구사항 정의, 일정 관리, 최종 결과 분석, 문서 작성 및 발표 총괄 |

---

## 📚 참고 문서

### 프로젝트 문서
- [최종 프로젝트 보고서](docs/최종_프로젝트_보고서.pdf)
- [통합 테스트 보고서](docs/테스트_보고서.pdf) - 85개 테스트, 98.57% 커버리지
- [LLM 활용 보고서](docs/LLM_활용_보고서.pdf) - AI 개발 가속화 (70% 시간 단축)
- [프로젝트 기획서](docs/planning.md)
- [요구사항 분석서](docs/requirements.md)
- [시스템 설계서](docs/design.md)
- [API 문서](http://localhost:8000/docs) - FastAPI Swagger UI

### 테스트 문서
- [Postman Collection](docs/test/postman_collection.json) - 19 requests
- [버그 트래킹](docs/test/bug_tracking.md) - 4건 발견 및 해결

---

## 🔬 참고 논문

본 프로젝트는 다음 논문을 기반으로 구현되었습니다:

> Cejudo, A., et al. (2025). "Attention-based RNN for Anomaly Detection in Activities of Daily Living"

**우리 프로젝트의 개선점:**
- ✅ 실제 응급/사망 라벨 데이터 활용 (논문: 시뮬레이션)
- ✅ Precision/Recall/F1 정확한 측정 (논문: MSE만)
- ✅ 100% Recall 달성 (논문: 측정 불가)
- ✅ 듀얼 트랙(집단+개인) 전략으로 오탐 제어

---

## 🎯 구현 현황

### Must Have 기능 (완료율)

| 기능 분류 | 세부 기능 | 상태 | 완료율 |
|----------|----------|------|--------|
| **데이터 파이프라인** | 30일 슬라이딩 윈도우 생성 | ✅ 완료 | 100% |
|  | MinMaxScaler 정규화 | ✅ 완료 | 100% |
| **AI 모델링** | Track A (Global) Attention RNN 학습 | ✅ 완료 | 100% |
|  | Track B (Personal) 파인튜닝 | ✅ 완료 | 100% |
|  | MAE 기반 교차 검증 이상 감지 | ✅ 완료 | 100% |
|  | Hourly / Temporal 어텐션 세분화 | 🔜 예정 | 0% |
| **시스템 통합** | DB 연동 및 1시간 주기 실시간 추론 | 🔧 진행중 | 50% |
|  | LLM 기반 자연어 리포트 생성 | 🔜 예정 | 0% |
|  | 복지사 대시보드 UI 연동 | 🔜 예정 | 0% |

---

## 🔧 개발 환경

### 필수 도구
- Python 3.11.15
- PostgreSQL 15+
- Node.js 18+
- Docker 24+

### 개발 도구
- **IDE**: VS Code, PyCharm
- **API 테스트**: Postman, FastAPI Swagger UI
- **버전 관리**: Git, SourceTree
- **AI 개발**: Google Colab (GPU), Claude AI

---

## 🤝 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**코딩 컨벤션:**
- Python: PEP 8, Black 포매터
- 테스트: pytest, AAA 패턴 (Arrange-Act-Assert)
- 커밋 메시지: Conventional Commits

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 📞 연락처

**프로젝트 문의:**
- GitHub Repository: [salpyeobom-backend](https://github.com/greenrain78/salpyeobom-backend)
- GitHub Issues: [이슈 등록](https://github.com/greenrain78/salpyeobom-backend/issues)

**담당 교수:**
- 정갑주 교수님 (건국대학교 컴퓨터공학부)

**파트너:**
- 리본케어 (Ribbon Care) - 실제 센서 데이터 및 도메인 지식 제공

---

## 🙏 감사의 말

- **정갑주 교수님** - 프로젝트 지도 및 연구 방향 제시
- **리본케어** - 실제 센서 데이터 및 현장 전문성 제공
- **Claude AI (Anthropic)** - 개발 가속화 지원 (70% 시간 단축)

---

## 📊 프로젝트 통계

- **개발 기간**: 2026년 1학기
- **총 커밋 수**: 200+ commits
- **코드 라인 수**: 10,000+ lines
- **테스트 케이스**: 85개 (98.57% 커버리지)
- **API 엔드포인트**: 9개
- **문서 페이지**: 50+ pages

---

**© 2026 살펴봄 팀 (9팀). All rights reserved.**

**과목**: 전공심화프로젝트(종합설계) | 3243-002  
**담당 교수**: 정갑주 교수님  
**학교**: 건국대학교 컴퓨터공학부
