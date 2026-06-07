/**
 * 살펴봄 관제 시스템 메인 애플리케이션 로직
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initInteractions();
});

/**
 * 1. 실시간 시계 초기화
 */
function initClock() {
    const update = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        document.getElementById('current-time').textContent = timeString;
    };

    setInterval(update, 1000);
    update();
}

/**
 * 2. 인터랙션 이벤트 핸들러 초기화
 */
function initInteractions() {
    const rows = document.querySelectorAll('tbody tr[data-id]');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            // 행 활성화 스타일 적용
            rows.forEach(r => r.classList.remove('active-row'));
            row.classList.add('active-row');
            
            // 상세 정보 업데이트
            const personId = row.getAttribute('data-id');
            updateDetailPanel(personId);
        });
    });
}

/**
 * 3. 오른쪽 상세 패널 내용 업데이트
 */
function updateDetailPanel(personId) {
    const data = PERSON_DATA[personId];
    if (!data) return;

    // 기본 정보 텍스트 업데이트
    const elements = {
        'detail-name': data.name,
        'detail-age': `(만 ${data.age}세)`,
        'detail-address': data.address,
        'detail-doc-no': `전자 문서 열람: No.${data.docNo}`,
        'detail-alert-title': data.alertTitle,
        'detail-alert-desc': data.alertDesc,
        'detail-manager': data.manager,
        'detail-level': data.alertLevel,
        'detail-visit-time': data.visitTime,
        'detail-visit-plan': data.visitPlan
    };

    for (let id in elements) {
        document.getElementById(id).textContent = elements[id];
    }

    // 이미지 업데이트
    document.getElementById('detail-image').src = data.image;

    // 알림 박스 스타일 및 아이콘 업데이트
    updateAlertTheme(data.type);

    // 보유 질환 태그 생성
    renderDiseaseTags(data.diseases);
}

/**
 * 상태별 알림 테마 변경
 */
function updateAlertTheme(type) {
    const alertBox = document.getElementById('detail-alert-box');
    const alertIcon = document.getElementById('detail-alert-icon');
    const alertTitle = document.getElementById('detail-alert-title');

    // 클래스 초기화 및 부여
    if (type === 'emergency') {
        alertBox.className = 'p-4 bg-orange-50 border border-orange-100 rounded-lg';
        alertIcon.className = 'fa-solid fa-triangle-exclamation text-orange-600 text-sm';
        alertTitle.className = 'text-xs font-black text-orange-700';
    } else if (type === 'warning') {
        alertBox.className = 'p-4 bg-red-50 border border-red-100 rounded-lg';
        alertIcon.className = 'fa-solid fa-circle-exclamation text-red-600 text-sm';
        alertTitle.className = 'text-xs font-black text-red-700';
    } else {
        alertBox.className = 'p-4 bg-blue-50 border border-blue-100 rounded-lg';
        alertIcon.className = 'fa-solid fa-circle-info text-blue-600 text-sm';
        alertTitle.className = 'text-xs font-black text-blue-700';
    }
}

/**
 * 질환 태그 렌더링
 */
function renderDiseaseTags(diseases) {
    const container = document.getElementById('detail-diseases');
    container.innerHTML = '';
    diseases.forEach(d => {
        const span = document.createElement('span');
        span.className = 'px-2 py-0.5 bg-slate-100 text-[10px] font-bold rounded';
        span.textContent = d;
        container.appendChild(span);
    });
}
