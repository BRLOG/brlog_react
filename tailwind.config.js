/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // DaisyUI 플러그인 추가!
  daisyui: {
    themes: ["light", "dark", "forest"], // 사용할 테마 목록
  },
};
