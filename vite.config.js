import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize React Fast Refresh
      fastRefresh: true,
      // Exclude admin panels from HMR for better performance
      exclude: /node_modules/,
    }), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Optimize HMR performance
    hmr: {
      // Reduce HMR update frequency
      overlay: true,
    },
    // Improve file watching
    watch: {
      // Ignore node_modules for better performance
      ignored: ['**/node_modules/**', '**/dist/**']
    }
  },
  build: {
    // Optimize build performance
    rollupOptions: {
      output: {
        // Split admin panel into separate chunk
        manualChunks: {
          admin: ['./src/admin/AdminPanel.jsx', './src/admin/AdminLogin.jsx', './src/admin/AdminDashboard.jsx'],
          vendor: ['react', 'react-dom', '@clerk/clerk-react']
        }
      }
    }
  },
  // Optimize dev dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@clerk/clerk-react', 'lucide-react']
  }
})