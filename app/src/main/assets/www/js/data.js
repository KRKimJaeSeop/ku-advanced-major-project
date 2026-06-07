/**
 * 대상자 관제 데이터 정의
 */
const PERSON_DATA = {
    'p1': {
        name: '김순자',
        age: '82',
        address: '서울특별시 노원구 상계동 123-4',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200',
        docNo: '2024-KSJ',
        alertTitle: '활동 미검출 긴급 경보',
        alertDesc: '오전 10:12부터 실시간 활동 센서로부터 움직임이 감지되지 않고 있습니다. 기저질환(고혈압)을 고려하여 즉각적인 신변 확인이 필요합니다.',
        alertLevel: '집중 모니터링 (A)',
        manager: '이영희 복지사',
        diseases: ['고혈압', '경증 치매', '퇴행성 관절염'],
        visitTime: '오늘 14:00 방문 예정',
        visitPlan: '방문 시 주간 투약 여부를 확인하고, 거실 활동 센서의 배터리 잔량을 점검할 예정입니다.',
        type: 'emergency'
    },
    'p2': {
        name: '최갑수',
        age: '79',
        address: '서울특별시 노원구 상계동 45-1',
        image: 'https://images.unsplash.com/photo-1544144433-d5075f799b36?auto=format&fit=crop&q=80&w=200',
        docNo: '2024-CGS',
        alertTitle: '낙상 의심 경보',
        alertDesc: '거실 센서에서 급격한 가속도 변화가 감지되었습니다. 현재 화상 통화 연결을 시도 중이나 응답이 없습니다.',
        alertLevel: '수위 높음 (B)',
        manager: '박철수 복지사',
        diseases: ['골다공증', '당뇨'],
        visitTime: '내일 10:00 방문 예정',
        visitPlan: '낙상 방지 보조 기구 설치 및 안전 교육을 실시할 예정입니다.',
        type: 'warning'
    },
    'p3': {
        name: '박영철',
        age: '75',
        address: '서울특별시 노원구 중계동 88-12',
        image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
        docNo: '2024-PYC',
        alertTitle: '정기 점검 알림',
        alertDesc: '오전 정기 투약 시간 경과 후 보호자를 통해 정상 확인되었습니다. 현재 특이사항 없이 휴식 중입니다.',
        alertLevel: '정기 점검 (C)',
        manager: '최미나 복지사',
        diseases: ['만성 위염', '고지혈증'],
        visitTime: '금요일 15:00 방문 예정',
        visitPlan: '정기 건강 상태 인터뷰 및 상비약 재고 확인이 예정되어 있습니다.',
        type: 'normal'
    }
};
