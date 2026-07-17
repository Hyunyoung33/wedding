import { WEDDING } from '../data/wedding.js';

let dbPromise;

// Firestore 인스턴스. 키가 없거나 초기화 실패 시 null — 호출부는 안내문으로 대체한다.
export function getDb() {
  if (!WEDDING.keys.firebase) return Promise.resolve(null);
  dbPromise ??= (async () => {
    try {
      const { initializeApp } = await import('firebase/app');
      const { getFirestore } = await import('firebase/firestore');
      return getFirestore(initializeApp(WEDDING.keys.firebase));
    } catch (e) {
      console.error('Firebase 초기화 실패', e);
      return null;
    }
  })();
  return dbPromise;
}
