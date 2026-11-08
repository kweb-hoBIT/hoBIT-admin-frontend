/**
 * 첫 로딩 화면(index.html의 #boot-splash) — 첫 화면이 다 그려질 때까지 덮어 둠
 *
 * 걷는 조건 (모두):
 *   - 화면 코드(지연 로딩 페이지)를 다 받음 — PageFallback이 떠 있는 동안은 기다림 (holdBoot)
 *   - 이 화면이 보낸 데이터 요청(fetch)이 모두 끝나고 잠깐(QUIET_MS) 조용함 — 요청이 이어지는 경우(로그인 확인 → 목록)도 기다림
 *   - 너무 오래 걸리면(MAX_MS) 그냥 걷음 — 느린 요청 하나 때문에 갇히지 않게
 * 실시간 채팅(socket.io)은 fetch가 아니라서 기다리지 않음.
 * 걷힌 뒤에야 숫자 올라가기·카드 나타나기를 시작 (whenBooted) — 로딩 화면 밑에서 미리 끝나 버리지 않게
 */

const QUIET_MS = 250;
const MIN_MS = 300;
const MAX_MS = 8000;

let booted = false;
let inflight = 0;
let holds = 0;
let lastActivity = performance.now();
const waiters: Array<() => void> = [];

/** 로딩 화면이 걷히면 실행 (이미 걷혔으면 바로) */
export function whenBooted(cb: () => void): void {
  if (booted) cb();
  else waiters.push(cb);
}

/** 화면 코드를 받는 동안 걷지 않게 — 반환된 함수로 해제 */
export function holdBoot(): () => void {
  if (booted) return () => {};
  holds++;
  lastActivity = performance.now();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holds--;
    lastActivity = performance.now();
  };
}

function finish() {
  if (booted) return;
  booted = true;
  const el = document.getElementById('boot-splash');
  if (el) {
    el.classList.add('hobit-splash--out');
    window.setTimeout(() => el.remove(), 300);
  }
  waiters.splice(0).forEach((cb) => cb());
}

/** React를 그리기 직전에 한 번 */
export function startBootSplash(): void {
  if (!document.getElementById('boot-splash')) {
    booted = true;
    return;
  }
  const origFetch = window.fetch.bind(window);
  window.fetch = (...args: Parameters<typeof fetch>) => {
    if (booted) return origFetch(...args);
    inflight++;
    lastActivity = performance.now();
    return origFetch(...args).finally(() => {
      inflight--;
      lastActivity = performance.now();
    });
  };

  const start = performance.now();
  const tick = () => {
    if (booted) return;
    const now = performance.now();
    const idle = inflight === 0 && holds === 0 && now - lastActivity >= QUIET_MS;
    if ((idle && now - start >= MIN_MS) || now - start >= MAX_MS) finish();
    else window.setTimeout(tick, 80);
  };
  window.setTimeout(tick, 80);
}
