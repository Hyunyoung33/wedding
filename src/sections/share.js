import { copyText } from '../lib/clipboard.js';
import { toast } from '../lib/toast.js';
import { formatDateKo } from '../data/wedding.js';

let sdkPromise;
function loadKakaoSdk(key) {
  sdkPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js';
    s.onload = () => {
      window.Kakao.init(key);
      resolve(window.Kakao);
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return sdkPromise;
}

export function mount(el, w) {
  el.innerHTML = `
    <div class="share-btns">
      ${w.keys.kakaoJs ? '<button class="btn share-kakao" id="share-kakao">카카오톡으로 공유하기</button>' : ''}
      <button class="btn" id="share-link">청첩장 링크 복사하기</button>
    </div>
    <p class="footer-note">${w.groom.name} · ${w.bride.name}의 결혼식에 와주셔서 감사합니다</p>
  `;

  el.querySelector('#share-link').addEventListener('click', async () => {
    toast((await copyText(location.href)) ? '링크가 복사되었습니다' : '복사에 실패했습니다');
  });

  const kakaoBtn = el.querySelector('#share-kakao');
  if (kakaoBtn) {
    kakaoBtn.addEventListener('click', async () => {
      try {
        const Kakao = await loadKakaoSdk(w.keys.kakaoJs);
        const url = location.origin + import.meta.env.BASE_URL;
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: w.share.title,
            description: w.share.description || `${formatDateKo(w.datetime)} · ${w.venue.name}`,
            imageUrl: url + w.share.thumbnail,
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [{ title: '청첩장 보기', link: { mobileWebUrl: url, webUrl: url } }],
        });
      } catch (e) {
        console.error('카카오 공유 실패', e);
        toast('카카오톡 공유를 사용할 수 없습니다');
      }
    });
  }
}
