import { useEffect } from 'react';

// Ajoute <meta name="robots" content="noindex,nofollow"> tant que ce composant
// est monté (donc pendant tout l'affichage du back-office), et le retire à la
// sortie. Empêche Google et les autres moteurs d'indexer le dashboard admin.
export default function NoIndexMeta() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow, noarchive';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return null;
}
