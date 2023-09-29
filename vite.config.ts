import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import proxy from "http-proxy-middleware";

// Define the proxy middleware options
const proxyOptions = {
  target: "http://localhost:3000", // Replace with your API server URL
  changeOrigin: true,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
});
