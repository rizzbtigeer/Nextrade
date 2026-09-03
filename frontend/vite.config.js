import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react(),
    // Génère des versions .gz et .br des fichiers de build : la plupart des
    // hébergeurs (Nginx, Vercel, Netlify...) les servent automatiquement,
    // ce qui réduit fortement la taille téléchargée par le visiteur.
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress', exclude: [/\.(gz)$/] })
  ],
  server: {
    port: 5173
  },
  build: {
    // Avertit si un morceau dépasse 700 Ko une fois compilé (aide à repérer
    // une dépendance trop lourde avant la mise en production)
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Sépare les grosses librairies dans leurs propres fichiers : elles ne
        // seront re-téléchargées par le navigateur que si elles changent,
        // même si le reste du code de l'app est mis à jour.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts']
        }
      }
    }
  }
});
