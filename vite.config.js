import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // JSX 처리를 위한 추가 설정 (js, jsx 파일 포함)
    include: "**/*.{jsx,js}",
  })],
  // 기본 경로 설정 (Context Path가 없다면 "/" 유지)
  base: "/",
  server: {
    port: 3000,
    // 백엔드(Spring Boot) 연동을 위한 프록시 설정
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    // 경로 별칭 설정 (@를 사용해 /src 경로 접근)
    alias: [{ find: "@", replacement: "/src" }],
  },
  test: {
    globals: true,
    include: ["src/**/*.test.js", "src/**/*.test.jsx"],
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    transformMode: {
      // 모든 JS/JSX/TS/TSX 파일을 웹 환경으로 변환
      web: [/\.[jt]sx?$/],
    },
  },
  build: {
    // 1. 빌드 결과물이 Spring Boot의 static 폴더로 가도록 경로 수정
    // outDir: path.resolve(__dirname, '../src/main/resources/static'),
    // 2. 빌드 시 기존 static 폴더 내용 삭제
    // emptyOutDir: true,
    // 빌드 시 청크 사이즈 제한 경고 수치 조절
    chunkSizeWarningLimit: 100000000,
  },
  // .js 파일에서도 JSX 문법을 사용할 수 있도록 설정
  esbuild: {
    loader: "jsx",
    // .js, .jsx, .ts, .tsx 확장자 모두 포함
    include: /\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
      },
    },
  },
});
