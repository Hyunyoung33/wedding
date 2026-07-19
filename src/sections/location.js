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
  const { name, hall, address, tel, transit = [], lat, lng } = w.venue;
  const enc = encodeURIComponent(name);

  const transitBlocks = transit
    .map(
      (group) => `
      <div class="loc-group">
        <h4 class="loc-sub">${group.title}</h4>
        <ul class="loc-list">
          ${group.items
            .map(
              (it) =>
                `<li>${it.dot ? `<span class="loc-dot" style="background:${it.dot}"></span>` : '<span class="loc-dot loc-dot-none"></span>'}${it.text}</li>`,
            )
            .join('')}
        </ul>
      </div>`,
    )
    .join('<hr class="loc-divider" />');

  el.innerHTML = `
    <p class="sec-label">Location</p>
    <h2 class="sec-title">오시는 길</h2>
    <p class="loc-name">${name} ${hall}</p>
    <p class="loc-addr">${address}</p>
    ${tel ? `<p class="loc-tel">Tel. <a href="tel:${tel}">${tel}</a></p>` : ''}
    ${w.keys.kakaoJs ? '<div id="kakao-map" class="loc-map" aria-label="예식장 지도"></div>' : ''}
    <button class="btn loc-copy" id="copy-addr">주소 복사하기</button>
    <div class="loc-group">
      <h4 class="loc-sub">내비게이션</h4>
      <p class="loc-navdesc">원하시는 앱을 선택하시면 길안내가 시작됩니다.</p>
      <div class="loc-btns">
        <button class="btn" data-nav="navermap"><span class="nav-ico" style="background:#03c75a">N</span>네이버지도</button>
        <button class="btn" data-nav="tmap"><span class="nav-ico" style="background:#ed1b23">T</span>티맵</button>
        <button class="btn" data-nav="kakaomap"><span class="nav-ico nav-ico-kakao" style="background:#fee500">K</span>카카오맵</button>
      </div>
    </div>
    ${transitBlocks ? `<hr class="loc-divider" />${transitBlocks}` : ''}
  `;

  el.querySelector('#copy-addr').addEventListener('click', async () => {
    toast((await copyText(address)) ? '주소가 복사되었습니다' : '복사에 실패했습니다');
  });

  const webMap = `https://map.kakao.com/link/map/${enc},${lat},${lng}`;
  const isAndroid = /android/i.test(navigator.userAgent);
  // 티맵은 웹 지도가 없어서, 앱이 없으면 설치 페이지로 안내
  const tmapStore = isAndroid
    ? 'https://play.google.com/store/apps/details?id=com.skt.tmap.ku'
    : 'https://apps.apple.com/kr/app/id431589174';
  const tmapQuery = `goalname=${enc}&goaly=${lat}&goalx=${lng}`;

  const NAV = {
    kakaomap: () => openApp(`kakaomap://look?p=${lat},${lng}`, webMap),
    navermap: () =>
      openApp(
        `nmap://place?lat=${lat}&lng=${lng}&name=${enc}&appname=wedding.invitation`,
        `https://map.naver.com/p/search/${enc}`,
      ),
    tmap: () => {
      if (isAndroid) {
        // 안드로이드는 intent 방식이 확실함 — 앱이 있으면 티맵 실행, 없으면 스토어로
        location.href = `intent://route?${tmapQuery}#Intent;scheme=tmap;package=com.skt.tmap.ku;S.browser_fallback_url=${encodeURIComponent(tmapStore)};end`;
      } else {
        openApp(`tmap://route?${tmapQuery}`, tmapStore);
      }
    },
  };
  el.querySelectorAll('[data-nav]').forEach((b) =>
    b.addEventListener('click', () => NAV[b.dataset.nav]()),
  );

  if (w.keys.kakaoJs) loadKakaoMap(el.querySelector('#kakao-map'), w);
}
