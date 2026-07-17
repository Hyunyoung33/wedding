import { copyText } from '../lib/clipboard.js';
import { toast } from '../lib/toast.js';

// 앱 딥링크: 미설치 시 1.5초 내 앱 전환(blur)이 없으면 웹 지도로 폴백
function openApp(appUrl, webUrl) {
  const timer = setTimeout(() => {
    if (!document.hidden) location.href = webUrl;
  }, 1500);
  window.addEventListener('blur', () => clearTimeout(timer), { once: true });
  location.href = appUrl;
}

function loadKakaoMap(el, w) {
  const { lat, lng, name } = w.venue;
  const s = document.createElement('script');
  s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${w.keys.kakaoJs}&autoload=false`;
  s.onload = () =>
    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(lat, lng);
      const map = new window.kakao.maps.Map(el, { center, level: 4 });
      new window.kakao.maps.Marker({ map, position: center, title: name });
    });
  s.onerror = () => el.remove(); // 지도 실패 시 주소 텍스트만 남긴다
  document.head.appendChild(s);
}

export function mount(el, w) {
  const { name, hall, address, tel, subway, bus, parking, lat, lng } = w.venue;
  const enc = encodeURIComponent(name);

  const infoLines = [
    subway && `<div class="loc-info"><strong>지하철</strong><span>${subway}</span></div>`,
    bus && `<div class="loc-info"><strong>버스</strong><span>${bus}</span></div>`,
    parking && `<div class="loc-info"><strong>주차</strong><span>${parking}</span></div>`,
  ]
    .filter(Boolean)
    .join('');

  el.innerHTML = `
    <p class="sec-label">Location</p>
    <h2 class="sec-title">오시는 길</h2>
    <div class="loc-card">
      <p class="loc-name">${name} ${hall}</p>
      <p class="loc-addr">${address}</p>
      ${tel ? `<p class="loc-tel"><a href="tel:${tel}">${tel}</a></p>` : ''}
      <button class="btn" id="copy-addr">주소 복사</button>
    </div>
    ${w.keys.kakaoJs ? '<div id="kakao-map" class="loc-map" aria-label="예식장 지도"></div>' : ''}
    <div class="loc-btns">
      <button class="btn" data-nav="kakaomap">카카오맵</button>
      <button class="btn" data-nav="navermap">네이버지도</button>
      <button class="btn" data-nav="tmap">티맵</button>
    </div>
    ${infoLines ? `<div class="loc-infos">${infoLines}</div>` : ''}
  `;

  el.querySelector('#copy-addr').addEventListener('click', async () => {
    toast((await copyText(address)) ? '주소가 복사되었습니다' : '복사에 실패했습니다');
  });

  const webMap = `https://map.kakao.com/link/map/${enc},${lat},${lng}`;
  const NAV = {
    kakaomap: [`kakaomap://look?p=${lat},${lng}`, webMap],
    navermap: [
      `nmap://place?lat=${lat}&lng=${lng}&name=${enc}&appname=wedding.invitation`,
      `https://map.naver.com/p/search/${enc}`,
    ],
    tmap: [`tmap://route?goalname=${enc}&goaly=${lat}&goalx=${lng}`, webMap],
  };
  el.querySelectorAll('[data-nav]').forEach((b) =>
    b.addEventListener('click', () => openApp(...NAV[b.dataset.nav])),
  );

  if (w.keys.kakaoJs) loadKakaoMap(el.querySelector('#kakao-map'), w);
}
