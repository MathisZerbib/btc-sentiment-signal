import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Listen on all IPv6 and IPv4 addresses
    port: 8080, // Set the port to 8080
    proxy: {
      '/api': {
        target: 'https://api.coingecko.com', // Proxy API requests to CoinGecko
        changeOrigin: true, // Change the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove the `/api` prefix from the request path
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Cache-Control'] = 'public, max-age=900'; // Cache responses for 15 minutes
          });
        },
      },
    },
  },
  plugins: [
    react(), // Use the React plugin for Vite
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Set up path aliases for `@/` to point to `./src`
    },
  },
}));