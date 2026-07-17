// ★★★ 청첩장의 모든 내용은 이 파일에서만 수정합니다 ★★★
// "⚠️ 교체 필요" 표시가 있는 항목은 실제 정보로 바꿔야 합니다.

export const WEDDING = {
  groom: {
    name: '두현민',
    phone: '010-0000-0000',                          // ⚠️ 교체 필요
    father: { name: '두○○', phone: '' },             // ⚠️ 교체 필요
    mother: { name: '○○○', phone: '' },              // ⚠️ 교체 필요
    order: '장남',                                    // ⚠️ 확인 필요 (장남/차남/아들)
  },
  bride: {
    name: '박현영',
    phone: '010-0000-0000',                          // ⚠️ 교체 필요
    father: { name: '박○○', phone: '' },             // ⚠️ 교체 필요
    mother: { name: '○○○', phone: '' },              // ⚠️ 교체 필요
    order: '장녀',                                    // ⚠️ 확인 필요 (장녀/차녀/딸)
  },

  // 예식 일시 (한국 시간). 형식: YYYY-MM-DDTHH:mm:00+09:00
  datetime: '2026-11-14T12:30:00+09:00',             // ⚠️ 교체 필요

  venue: {
    name: '○○웨딩홀',                                 // ⚠️ 교체 필요
    hall: '2층 ○○홀',                                 // ⚠️ 교체 필요
    address: '서울특별시 중구 세종대로 110',            // ⚠️ 교체 필요
    lat: 37.5665,                                     // ⚠️ 교체 필요 (카카오맵에서 좌표 확인)
    lng: 126.978,                                     // ⚠️ 교체 필요
    tel: '',                                          // 예식장 대표번호 (선택)
    subway: '',                                       // 예: '2호선 시청역 4번 출구 도보 5분'
    bus: '',                                          // 예: '간선 401, 406 시청앞 하차'
    parking: '',                                      // 예: '건물 지하주차장 2시간 무료'
  },

  greeting: {
    title: '소중한 분들을 초대합니다',
    message:
      '서로가 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어갈 수 있는 큰 사랑으로 키우고자 합니다.\n\n저희 두 사람이 사랑의 이름으로\n지켜나갈 수 있게 앞날을\n축복해 주시면 감사하겠습니다.',
  },

  accounts: {
    groom: [
      { bank: '○○은행', number: '000-0000-0000', holder: '두현민', kakaopay: '' }, // ⚠️ 교체 필요
    ],
    bride: [
      { bank: '○○은행', number: '000-0000-0000', holder: '박현영', kakaopay: '' }, // ⚠️ 교체 필요
    ],
  },

  // scripts/optimize-images.mjs 실행 후 출력된 목록을 붙여넣습니다.
  gallery: [
    'photo-01.webp',
    'photo-02.webp',
    'photo-03.webp',
    'photo-04.webp',
    'photo-05.webp',
    'photo-06.webp',
  ],
  mainImage: 'photo-01.webp',   // 커버 사진 파일명

  bgm: '',         // 'bgm.mp3' 를 넣으면 배경음악 활성화 (public/ 폴더에 파일 필요)
  videoUrl: '',    // 유튜브 링크를 넣으면 식전영상 섹션 활성화

  share: {
    title: '두현민 ♥ 박현영, 결혼합니다',
    description: '',                    // 비우면 날짜·장소로 자동 생성
    thumbnail: 'images/og.jpg',
  },

  keys: {
    kakaoJs: '',        // ⚠️ 카카오 개발자 JavaScript 키 (Task 5에서 발급)
    firebase: null,     // ⚠️ Firebase 설정 객체 (Task 8에서 발급)
  },
};

// 날짜 표시용 헬퍼 — 설정에서 파생되는 값들
const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export function formatDateKo(iso = WEDDING.datetime) {
  const d = new Date(iso);
  const h = d.getHours();
  const ampm = h < 12 ? '오전' : h < 18 ? '낮' : '저녁';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const min = d.getMinutes();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${DAYS_KO[d.getDay()]}요일 ${ampm} ${h12}시${min ? ` ${min}분` : ''}`;
}

export function formatDateShort(iso = WEDDING.datetime) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())}`;
}
