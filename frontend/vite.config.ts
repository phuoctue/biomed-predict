import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Cần import path

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Cấu hình để Vite hiểu @/ trỏ tới thư mục src
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});