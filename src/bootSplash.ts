/**
 * 호빗 캐릭터 로딩 — 화면이 다 그려질 때까지 덮어 둠
 *
 *  1) 첫 로딩: index.html의 #boot-splash (자바스크립트 준비 전부터 보임)
 *  2) 화면 이동(탭·하위 탭·주소 변경): 헤더는 그대로 두고 본문 자리에 같은 캐릭터 (NavLoader)
 *
 * 걷는 조건 (모두):
 *   - 화면 코드(지연 로딩 페이지)를 다 받음 — PageFallback이 떠 있는 동안은 기다림 (holdBoot)
 *   - 이동 뒤 보낸 데이터 요청(fetch)이 모두 끝나고 잠깐(QUIET_MS) 조용함 — 요청이 이어지는 경우도 기다림
 *   - 너무 오래 걸리면(MAX_MS) 그냥 걷음 — 느린 요청 하나 때문에 갇히지 않게
 * 화면 이동은 SHOW_AFTER_MS 안에 끝나면(받아 둔 데이터로 바로 그려지면) 캐릭터를 아예 띄우지 않음 — 깜빡임 방지.
 * 실시간 채팅(socket.io)은 fetch가 아니라서 기다리지 않음. 무한 스크롤처럼 이동과 상관없는 요청도 기다리지 않음.
 * 걷힌 뒤에야 숫자 올라가기·카드 나타나기를 시작 (whenBooted) — 로딩 화면 밑에서 미리 끝나 버리지 않게
 */

const QUIET_MS = 250;
const MIN_MS = 300;
const MAX_MS = 8000;
const SHOW_AFTER_MS = 150;

let busy = true; // 첫 로딩부터 시작
let isBoot = true;
let tracking = true; // 이 동안 시작된 fetch만 기다림
let inflight = 0;
let holds = 0;
let started = performance.now();
let lastActivity = started;
let timer: number | undefined;
let navVisible = false;
const waiters: Array<() => void> = [];
const listeners = new Set<(visible: boolean) => void>();

const setNavVisible = (v: boolean) => {
  if (navVisible === v) return;
  navVisible = v;
  listeners.forEach((fn) => fn(v));
};

/** 화면 이동 로딩(캐릭터)이 보이는지 구독 — NavLoader용 */
export function subscribeNavLoading(fn: (visible: boolean) => void): () => void {
  listeners.add(fn);
  fn(navVisible);
  return () => {
    listeners.delete(fn);
  };
}

/** 로딩이 걷히면 실행 (로딩 중이 아니면 바로) */
export function whenBooted(cb: () => void): void {
  if (!busy) cb();
  else waiters.push(cb);
}

/** 화면 코드를 받는 동안 걷지 않게 — 반환된 함수로 해제 */
export function holdBoot(): () => void {
  // 로딩 중이 아니어도 셈 — 화면 이동 때는 PageFallback(자식)이 Layout(부모)의 이동 시작보다 먼저 불림
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
  busy = false;
  tracking = false;
  window.clearTimeout(timer);
  if (isBoot) {
    isBoot = false;
    const el = document.getElementById('boot-splash');
    if (el) {
      el.classList.add('hobit-splash--out');
      window.setTimeout(() => el.remove(), 300);
    }
  }
  setNavVisible(false);
  waiters.splice(0).forEach((cb) => cb());
}

function tick() {
  if (!busy) return;
  const now = performance.now();
  const idle = inflight === 0 && holds === 0 && now - lastActivity >= QUIET_MS;
  if ((idle && now - started >= (isBoot ? MIN_MS : 0)) || now - started >= MAX_MS) {
    finish();
    return;
  }
  if (!isBoot && now - started >= SHOW_AFTER_MS) setNavVisible(true);
  timer = window.setTimeout(tick, 60);
}

/** 화면을 옮길 때 (Layout이 주소 변경을 보고 부름) */
export function startNavLoading(): void {
  if (isBoot) return; // 첫 로딩 중이면 그대로 이어서
  busy = true;
  tracking = true;
  inflight = 0;
  started = performance.now();
  lastActivity = started;
  window.clearTimeout(timer);
  timer = window.setTimeout(tick, 60);
}

/** React를 그리기 직전에 한 번 */
export function startBootSplash(): void {
  const origFetch = window.fetch.bind(window);
  window.fetch = (...args: Parameters<typeof fetch>) => {
    if (!tracking) return origFetch(...args);
    inflight++;
    lastActivity = performance.now();
    const gen = started; // 다음 이동이 시작되면 이전 요청은 셈에서 빠짐
    return origFetch(...args).finally(() => {
      if (gen !== started) return;
      inflight = Math.max(0, inflight - 1);
      lastActivity = performance.now();
    });
  };
  if (!document.getElementById('boot-splash')) {
    isBoot = false;
    finish();
    return;
  }
  timer = window.setTimeout(tick, 60);
}
