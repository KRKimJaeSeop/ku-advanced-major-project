/**
 * 살펴봄 관제 시스템 메인 애플리케이션 로직
 */

// ── 스타일 설정 상수 ─────────────────────────────
const CATEGORY_BADGE = {
    '낙상': 'bg-red-100 text-red-600 border-red-200',
    '응급': 'bg-red-100 text-red-600 border-red-200',
    '미응답': 'bg-orange-100 text-orange-600 border-orange-200',
    '지연': 'bg-orange-100 text-orange-600 border-orange-200',
    '투약': 'bg-blue-100 text-blue-600 border-blue-200',
};

const ALERT_THEMES = {
    emergency: {
        box:   'p-4 bg-orange-50 border border-orange-100 rounded-lg',
        icon:  'fa-solid fa-triangle-exclamation text-orange-600 text-sm',
        title: 'text-xs font-black text-orange-700',
    },
    warning: {
        box:   'p-4 bg-red-50 border border-red-100 rounded-lg',
        icon:  'fa-solid fa-circle-exclamation text-red-600 text-sm',
        title: 'text-xs font-black text-red-700',
    },
    normal: {
        box:   'p-4 bg-blue-50 border border-blue-100 rounded-lg',
        icon:  'fa-solid fa-circle-info text-blue-600 text-sm',
        title: 'text-xs font-black text-blue-700',
    },
};

// ── 상태 ────────────────────────────────────────
let currentSituationId = null;

// ── 초기화 ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => initAuth());

// ══════════════════════════════════════════════════
// 인증
// ══════════════════════════════════════════════════

function initAuth() {
    if (sessionStorage.getItem('salpyobom_token')) {
        showDashboard();
        return;
    }

    on('btn-login',       'click',   handleLogin);
    on('login-id',        'keydown', e => e.key === 'Enter' && handleLogin());
    on('login-pw',        'keydown', e => e.key === 'Enter' && handleLogin());
    on('btn-signup',      'click',   handleSignup);
    on('btn-show-signup', 'click',   () => toggleForms(false));
    on('btn-show-login',  'click',   () => toggleForms(true));
}

function toggleForms(showLogin) {
    document.getElementById('login-form-wrap') .classList.toggle('hidden', !showLogin);
    document.getElementById('signup-form-wrap').classList.toggle('hidden',  showLogin);
}

async function handleLogin() {
    const username = val('login-id');
    const password = val('login-pw');
    const errorEl  = el('login-error');
    const btn      = el('btn-login');

    if (!username || !password) return showMsg(errorEl, '아이디와 비밀번호를 입력해주세요.');

    setBtn(btn, true, '로그인 중...');
    try {
        const res = await API.login(username, password);
        sessionStorage.setItem('salpyobom_token', res.access_token);
        showDashboard();
    } catch (err) {
        showMsg(errorEl, err?.data?.detail || '아이디 또는 비밀번호가 올바르지 않습니다.');
        setBtn(btn, false, '로그인');
    }
}

async function handleSignup() {
    const username  = val('signup-id');
    const email     = val('signup-email');
    const pw        = val('signup-pw');
    const pw2       = val('signup-pw2');
    const errorEl   = el('signup-error');
    const successEl = el('signup-success');
    const btn       = el('btn-signup');

    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');

    if (!username || !email || !pw || !pw2) return showMsg(errorEl, '모든 항목을 입력해주세요.');
    if (pw !== pw2) return showMsg(errorEl, '비밀번호가 일치하지 않습니다.');

    setBtn(btn, true, '가입 중...');
    try {
        await API.register(username, email, pw);
        showMsg(successEl, '가입이 완료되었습니다. 로그인해주세요.');
        ['signup-id', 'signup-email', 'signup-pw', 'signup-pw2'].forEach(id => el(id).value = '');
        setTimeout(() => { toggleForms(true); successEl.classList.add('hidden'); }, 2000);
    } catch (err) {
        const detail = err?.data?.detail;
        const msg = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : (detail || '회원가입에 실패했습니다.');
        showMsg(errorEl, msg);
    } finally {
        setBtn(btn, false, '가입하기');
    }
}

function logout() {
    sessionStorage.removeItem('salpyobom_token');
    location.reload();
}

// ══════════════════════════════════════════════════
// 대시보드
// ══════════════════════════════════════════════════

async function showDashboard() {
    el('login-screen')   .style.display = 'none';
    el('dashboard-wrap') .style.display = 'flex';

    initClock();
    on('btn-logout', 'click', logout);

    try {
        const user = await API.me();
        setText('sidebar-username', user.username);
        setText('sidebar-email',    user.email);
    } catch (_) {}

    loadDashboardSummary();
    loadActiveSituations();
}

async function loadDashboardSummary() {
    try {
        const { data: d } = await API.getDashboardSummary();
        el('stat-emergency').textContent = String(d.emergency_count).padStart(2, '0');
        el('stat-warning')  .textContent = String(d.warning_count).padStart(2, '0');
        el('stat-normal')   .textContent = String(d.normal_count).padStart(2, '0');
        el('stat-total')    .textContent = d.total_monitoring_count;
    } catch (_) {}
}

async function loadActiveSituations() {
    try {
        const { data } = await API.getActiveSituations();
        renderSituationsTable(data.situations);
    } catch (_) {
        el('situations-tbody').innerHTML =
            '<tr><td colspan="5" class="px-6 py-8 text-center text-red-400 text-sm">데이터를 불러오지 못했습니다.</td></tr>';
    }
}

// ══════════════════════════════════════════════════
// 상황 테이블 렌더링
// ══════════════════════════════════════════════════

function renderSituationsTable(situations) {
    const tbody = el('situations-tbody');
    if (!situations?.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-slate-400 text-sm">현재 활성 상황이 없습니다.</td></tr>';
        return;
    }

    tbody.innerHTML = situations.map((s, idx) => situationRow(s, idx === 0)).join('');

    tbody.querySelectorAll('tr[data-patient-id]').forEach(row => {
        row.addEventListener('click', () => {
            tbody.querySelectorAll('tr').forEach(r => r.classList.remove('active-row'));
            row.classList.add('active-row');
            loadPatientDetail(row.dataset.patientId, +row.dataset.situationId);
        });
    });

    loadPatientDetail(situations[0].patient_id, situations[0].situation_id);
}

function situationRow(s, isFirst) {
    const badgeCls = getCategoryBadge(s.category);
    const rowCls   = isFirst
        ? 'active-row cursor-pointer transition-colors'
        : `hover:bg-slate-50 cursor-pointer transition-colors${s.action_status === '조치 완료' ? ' opacity-70' : ''}`;

    return `
    <tr class="${rowCls}" data-situation-id="${s.situation_id}" data-patient-id="${s.patient_id}">
        <td class="px-6 py-4">
            <div class="font-bold text-slate-800">${s.name}</div>
            <div class="text-[10px] text-slate-500">${s.address_summary}</div>
        </td>
        <td class="px-6 py-4"><span class="px-2 py-0.5 ${badgeCls} text-[10px] font-black rounded border">${s.category}</span></td>
        <td class="px-6 py-4 text-sm text-slate-600">${s.detail_reason || '-'}</td>
        <td class="px-6 py-4 text-xs font-mono text-slate-400">${formatTime(s.occurred_at)}</td>
        <td class="px-6 py-4 text-center">${getStatusCell(s.action_status)}</td>
    </tr>`;
}

function getCategoryBadge(category) {
    const match = Object.entries(CATEGORY_BADGE).find(([key]) => category.includes(key));
    return match ? match[1] : 'bg-slate-100 text-slate-600 border-slate-200';
}

function getStatusCell(status) {
    if (status === '조치 대기')
        return `<div class="flex items-center justify-center gap-1.5"><span class="w-1.5 h-1.5 bg-red-500 rounded-full pulse-red"></span><span class="text-[11px] font-bold text-red-600">조치 대기</span></div>`;
    if (status === '현장 출동')
        return `<div class="flex items-center justify-center gap-1.5"><span class="w-1.5 h-1.5 bg-sky-500 rounded-full"></span><span class="text-[11px] font-bold text-sky-600">현장 출동</span></div>`;
    return `<span class="text-[11px] font-bold text-slate-400">조치 완료</span>`;
}

function formatTime(iso) {
    if (!iso) return '--:--:--';
    const d = new Date(iso);
    const p = n => String(n).padStart(2, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

// ══════════════════════════════════════════════════
// 환자 상세 패널
// ══════════════════════════════════════════════════

async function loadPatientDetail(patientId, situationId) {
    currentSituationId = situationId;
    try {
        const { data } = await API.getPatientDetails(patientId);
        renderDetailPanel(data);
    } catch (_) {}
}

function renderDetailPanel(d) {
    const { ai_analysis: ai, administration: adm } = d;

    setText('detail-doc-no',      `전자 문서 열람: No.${d.doc_no || '---'}`);
    setText('detail-name',        d.name);
    setText('detail-age',         `(만 ${d.age}세)`);
    setText('detail-address',     d.address_full);
    setText('detail-alert-title', ai.alert_title);
    setText('detail-alert-desc',  ai.alert_desc);
    setText('detail-manager',     adm.manager_name);
    setText('detail-level',       adm.management_level);
    setText('detail-visit-time',  adm.next_visit_time);
    setText('detail-visit-plan',  adm.next_visit_plan);

    el('detail-image').src = d.profile_image_url || '';

    const lvl  = ai.cross_verification_level || '';
    const type = lvl.includes('A') || lvl.includes('긴급') ? 'emergency'
               : lvl.includes('B') || lvl.includes('높음') ? 'warning'
               : 'normal';
    updateAlertTheme(type);
    renderDiseaseTags(adm.diseases || []);
}

function updateAlertTheme(type) {
    const theme = ALERT_THEMES[type] ?? ALERT_THEMES.normal;
    el('detail-alert-box')  .className = theme.box;
    el('detail-alert-icon') .className = theme.icon;
    el('detail-alert-title').className = theme.title;
}

function renderDiseaseTags(diseases) {
    el('detail-diseases').innerHTML = diseases
        .map(d => `<span class="px-2 py-0.5 bg-slate-100 text-[10px] font-bold rounded">${d}</span>`)
        .join('');
}

// ══════════════════════════════════════════════════
// 조치 버튼
// ══════════════════════════════════════════════════

on('btn-action-call', 'click', () => submitAction('유선 연락', null,               '조치 완료'), true);
on('btn-action-log',  'click', () => {
    const note = prompt('업무 일지 내용을 입력하세요:');
    if (note !== null) submitAction('기타', note, '조치 완료');
}, true);

async function submitAction(actionType, note, statusUpdate) {
    if (!currentSituationId) return;
    try {
        await API.createAction(currentSituationId, actionType, note, statusUpdate);
        alert('업무 일지가 등록되었습니다.');
        loadActiveSituations();
        loadDashboardSummary();
    } catch (_) {
        alert('등록에 실패했습니다. 다시 시도해주세요.');
    }
}

// ══════════════════════════════════════════════════
// 실시간 시계
// ══════════════════════════════════════════════════

function initClock() {
    const update = () => {
        const now = new Date();
        const p   = n => String(n).padStart(2, '0');
        setText('current-time',
            `${now.getFullYear()}-${p(now.getMonth()+1)}-${p(now.getDate())} ${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`
        );
    };
    setInterval(update, 1000);
    update();
}

// ══════════════════════════════════════════════════
// DOM 유틸
// ══════════════════════════════════════════════════

function el(id)               { return document.getElementById(id); }
function val(id)              { return el(id).value.trim(); }
function setText(id, v)       { const e = el(id); if (e) e.textContent = v ?? '-'; }
function showMsg(el, msg)     { el.textContent = msg; el.classList.remove('hidden'); }
function setBtn(btn, disabled, text) { btn.disabled = disabled; btn.textContent = text; }
function on(id, event, handler, defer = false) {
    if (defer) {
        // 버튼이 아직 DOM에 없을 수 있으므로 이벤트 위임 사용
        document.addEventListener(event, e => { if (e.target.closest(`#${id}`)) handler(e); });
    } else {
        const e = el(id);
        if (e) e.addEventListener(event, handler);
    }
}
