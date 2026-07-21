// ★★★ 청첩장의 모든 내용은 이 파일에서만 수정합니다 ★★★
// "⚠️ 교체 필요" 표시가 있는 항목은 실제 정보로 바꿔야 합니다.

export const WEDDING = {
  groom: {
    name: '두현민',
    phone: '010-3308-7781',
    father: { name: '두헌균', phone: '' },
    mother: { name: '박외숙', phone: '' },
    order: '장남',
  },
  bride: {
    name: '박현영',
    phone: '010-6233-5494',
    father: { name: '박종근', phone: '' },
    mother: { name: '김희숙', phone: '' },
    order: '차녀',
  },

  // 예식 일시 (한국 시간). 형식: YYYY-MM-DDTHH:mm:00+09:00
  datetime: '2026-10-31T12:20:00+09:00',
  holidays: [3, 9], // 예식 달의 공휴일 (달력에 분홍색 표시) — 10월: 개천절, 한글날

  venue: {
    name: '신도림 테크노마트 웨딩시티',
    hall: '11층 그랜드볼룸홀',
    address: '서울특별시 구로구 새말로 97',
    lat: 37.507,                                      // 신도림 테크노마트 (카카오 키 연동 후 미세조정)
    lng: 126.8908,
    tel: '',                                          // 예식장 대표번호 (선택)
    // 교통 안내 — 그룹별로 표시. dot: 노선 색 점 (생략 시 회색 점)
    transit: [
      {
        title: '지하철',
        items: [
          { dot: '#0052A4', text: '1호선 신도림역 3번 출구' },
          { dot: '#00A84D', text: '2호선 신도림역 3번 출구' },
          { text: '테크노마트 판매동 지하 1층과 직접 연결' },
        ],
      },
      {
        title: '버스',
        items: [
          { dot: '#0068b7', text: '간선 160, 503, 600, 660, 662' },
          { dot: '#53b332', text: '지선 5615, 5714, 6512, 6515, 6516, 6637, 6640A, 6713' },
          { dot: '#e60012', text: '직행 301, 320' },
          { text: '일반 10, 11-1, 11-2, 83, 88, 530 · 공항 6018' },
          { text: '신도림역 1번 출구 쪽 하차 후 지하보도 이용' },
        ],
      },
      {
        title: '주차',
        items: [
          { text: '테크노마트 지하주차장 이용 (B3~B7)' },
          { text: '주차요원의 안내를 받으세요' },
        ],
      },
    ],
  },

  greeting: {
    title: '소중한 분들을 초대합니다',
    message:
      '함께 있는 것만으로도 마음이 편안해지고,\n있는 그대로의 나조차 사랑하게 만들어준\n사람을 만났습니다\n\n같은 방향을 바라보며 함께하는\n일상의 순간마다\n감사함과 행복을 배워왔습니다\n\n같은 마음으로 같은 길을 걸어가기로 한\n저희 두 사람의 시작에\n소중한 인연으로 곁을 지켜주신 여러분을\n모시고자 합니다\n\n오셔서 따뜻한 마음으로 축복해주시면\n큰 기쁨으로 간직하겠습니다',
  },

  accounts: {
    groom: [
      { label: '신랑', bank: '카카오뱅크', number: '3333-25-1696081', holder: '두현민', kakaopay: '' },
      { label: '아버지', bank: '신한은행', number: '110-435-304430', holder: '두헌균', kakaopay: '' },
      { label: '어머니', bank: 'NH농협은행', number: '302-2339-7781-91', holder: '박외숙', kakaopay: '' },
    ],
    bride: [
      { label: '신부', bank: '국민은행', number: '763602-04-138790', holder: '박현영', kakaopay: '' },
      { label: '아버지', bank: 'NH농협은행', number: '457-12-258963', holder: '박종근', kakaopay: '' },
      { label: '어머니', bank: 'NH농협은행', number: '457-12-188433', holder: '김희숙', kakaopay: '' },
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
    'photo-07.webp',
    'photo-08.webp',
    'photo-09.webp',
    'photo-10.webp',
    'photo-11.webp',
    'photo-12.webp',
  ],
  mainImage: 'photo-12.webp',   // 커버 사진 파일명 (청첩장 사진 폴더의 12번)

  bgm: 'bgm.mp3',  // 배경음악: Romantic Wedding Piano (PaulYudin, Pixabay 무료 라이선스)
  videoUrl: '',    // 유튜브 링크를 넣으면 식전영상 섹션 활성화

  coverStyle: 'wave',   // 커버 스타일: 'wave'(웨이브 텍스트+빛망울) / 'arch'(아치형) / 'full'(풀스크린)
  firstMet: '',         // 처음 만난 날 (예: '2020-05-10') — 넣으면 '함께한 시간' 실시간 카운터 표시  ⚠️ 날짜 필요
  rsvpPopup: true,      // 접속 시 참석여부 안내 팝업 표시 여부
  guestSnap: {
    url: 'https://photos.app.goo.gl/hH9GnXTYp2yD4T2z7', // 구글 포토 공유 앨범 (축하 사진 공유)
  },

  share: {
    title: '두현민 ♥ 박현영, 결혼합니다',
    description: '',                    // 비우면 날짜·장소로 자동 생성
    thumbnail: 'images/og-v2.jpg',
  },

  keys: {
    kakaoJs: '361a272621b368f588af84ba79efd5af', // 카카오 개발자 JavaScript 키 (wedding 앱)
    firebase: {
      apiKey: 'AIzaSyB2hUt7XtRrNk7vNGbHkimehyGaIwBx4MQ',
      authDomain: 'mobile-v01.firebaseapp.com',
      projectId: 'mobile-v01',
      storageBucket: 'mobile-v01.firebasestorage.app',
      messagingSenderId: '314579470892',
      appId: '1:314579470892:web:eab22dbb2b95b0e2125f89',
    },
  },
};

// 날짜 표시용 헬퍼 — 설정에서 파생되는 값들
const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

// 예식 일시를 항상 한국시간(KST) 기준 구성요소로 반환.
// 보는 사람의 기기 시간대와 무관하게 늘 같은 값이 나오도록 UTC+9로 고정한다.
export function kstParts(iso = WEDDING.datetime) {
  const k = new Date(new Date(iso).getTime() + 9 * 3600000);
  return {
    year: k.getUTCFullYear(),
    month: k.getUTCMonth(), // 0-based
    date: k.getUTCDate(),
    day: k.getUTCDay(),
    hours: k.getUTCHours(),
    minutes: k.getUTCMinutes(),
  };
}

export function formatDateKo(iso = WEDDING.datetime) {
  const { year, month, date, day, hours, minutes } = kstParts(iso);
  const ampm = hours < 12 ? '오전' : hours < 18 ? '낮' : '저녁';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${year}년 ${month + 1}월 ${date}일 ${DAYS_KO[day]}요일 ${ampm} ${h12}시${minutes ? ` ${minutes}분` : ''}`;
}

export function formatDateShort(iso = WEDDING.datetime) {
  const { year, month, date } = kstParts(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${year}. ${pad(month + 1)}. ${pad(date)}`;
}
