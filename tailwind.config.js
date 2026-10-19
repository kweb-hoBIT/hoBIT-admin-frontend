/** @type {import('tailwindcss').Config} */
// 색은 리뉴얼 호빗(사용자 화면)과 같은 토큰 — 값은 src/index.css의 :root / html.dark
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // html.dark 클래스로 나이트 모드 (저장값 > 시스템 설정, public/index.html에서 렌더 전 적용)
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        page: token('page'),            // 화면 배경
        surface: token('surface'),      // 헤더·표·폼 바탕
        card: token('card'),            // 카드·표 머리·hover
        'card-2': token('card-2'),      // 입력칸 눌림, 보조 버튼
        'card-3': token('card-3'),      // 보조 버튼 hover
        senior: token('senior'),        // 선배 FAQ 강조
        ink: token('ink'),              // 본문 글자
        'ink-2': token('ink-2'),        // 보조 글자
        'ink-3': token('ink-3'),        // 흐린 글자·아이콘
        link: token('link'),
        line: token('line'),            // 테두리·구분선
        accent: token('accent'),        // 호빗 색 — 주요 버튼 배경
        'accent-ink': token('accent-ink'), // 호빗 색 글자 (나이트에서는 밝게)
        danger: token('danger'),        // 삭제·오류
        'danger-soft': token('danger-soft'),
        success: token('success'),
        'success-soft': token('success-soft'),
        warn: token('warn'),
        'warn-soft': token('warn-soft'),
        crimson: token('accent'),       // 예전 이름 (호환)
      },
      // 색을 지정하지 않은 테두리도 테마를 따름
      borderColor: { DEFAULT: token('line') },
      fontFamily: {
        sans: ['Freesentation', '-apple-system', 'BlinkMacSystemFont', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
        '7bold': ['Freesentation', 'sans-serif'],
        '6semibold': ['Freesentation', 'sans-serif'],
        '5medium': ['Freesentation', 'sans-serif'],
        '4regular': ['Freesentation', 'sans-serif'],
      },
      keyframes: {
        appear: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: { appear: 'appear .3s ease-out both' },
    },
  },
  plugins: [],
};
