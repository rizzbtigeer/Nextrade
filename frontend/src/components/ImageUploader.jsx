// src/components/ImageUploader.jsx
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';

export default function ImageUploader({ images = [], onChange, maxImages = 6 }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) {
      setError('Aucun fichier sélectionné');
      return;
    }

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images autorisées`);
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success && response.data.files) {
        const newImages = response.data.files.map(file => file.url);
        onChange([...images, ...newImages]);
        fileInputRef.current.value = '';
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
      } else {
        setError('Format de réponse inattendu');
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div 
            key={index} 
            className="relative h-24 w-24 rounded-lg border border-ink/10 overflow-hidden group bg-paper"
          >
            <img 
              src={url} 
              alt={`Image ${index + 1}`} 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10"%3EImage%3C/text%3E%3C/svg%3E';
              }}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
              aria-label="Supprimer l'image"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-ink/15 text-ink-soft hover:border-brand hover:text-brand transition disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {uploading ? (
              <>
                <div className="animate-spin h-6 w-6 border-2 border-brand border-t-transparent rounded-full" />
                <span className="mt-1 text-xs">{uploadProgress}%</span>
              </>
            ) : (
              <>
                <ImageIcon size={20} />
                <span className="mt-1 text-xs text-center leading-tight">Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
      
      <p className="text-xs text-ink-soft">
        {images.length} / {maxImages} images • Formats: JPG, PNG, WEBP, GIF • Max: 5MB
      </p>
    </div>
  );
}