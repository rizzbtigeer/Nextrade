import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';
import api from '../api/axios.js';

export default function CategoryStrip() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat._id}
          to={`/catalogue?category=${cat._id}`}
          className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-brand hover:text-brand"
        >
          <Shirt size={14} />
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
