import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/USTIU-Africa-HealthCare-Queue-Management-System/',   // ← Add this line
})
