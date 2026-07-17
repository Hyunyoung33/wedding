// 식전영상 (유튜브). wedding.js 의 videoUrl 이 있을 때만 표시됩니다.
function youtubeId(url) {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function mount(el, w) {
  const id = youtubeId(w.videoUrl || '');
  if (!id) {
    el.remove();
    return;
  }
  el.innerHTML = `
    <p class="sec-label">Video</p>
    <h2 class="sec-title">식전 영상</h2>
    <div class="video-wrap">
      <iframe
        src="https://www.youtube.com/embed/${id}"
        title="식전 영상"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  `;
}
