import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'handle-html-rewrites',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // If the URL is /application-tracker, redirect to /track
          if (req.url === '/application-tracker') {
            console.log('Middleware redirecting /application-tracker to /track');
            res.writeHead(302, {
              Location: '/track'
            });
            res.end();
            return;
          }
          next();
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
        },
      },
    },
  },
  server: {
    port: 3000,
    // This is the key configuration for SPA routing
    historyApiFallback: true,
    // Middleware configuration for SPA
    middleware: [
      (req, res, next) => {
        // For SPA, any URL that doesn't contain a file extension should be 
        // handled by the SPA router
        if (!req.url.includes('.')) {
          console.log(`SPA middleware handling: ${req.url}`);
          // Let React Router handle it
          next();
        } else {
          next();
        }
      }
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
