import React from 'react';

export default function PageLoader() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand"
        role="status"
        aria-label="Chargement en cours"
      />
    </div>
  );
}
