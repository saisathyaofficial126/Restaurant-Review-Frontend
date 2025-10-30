import { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useOutletContext } from 'react-router';

export default function MenuSection() {
  const { restaurantData } = useOutletContext();
  const menuImages = (restaurantData.menuImages || []).map(img =>
    `${import.meta.env.VITE_BACKEND_URL}/uploads/${img}`
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft' && lightboxOpen) prev();
      if (e.key === 'ArrowRight' && lightboxOpen) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, currentIdx]);

  const openAt = (idx) => {
    setCurrentIdx(idx);
    setLightboxOpen(true);
  };
  const close = () => setLightboxOpen(false);
  const prev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const next = () => setCurrentIdx((i) => Math.min(menuImages.length - 1, i + 1));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{restaurantData.name} Menu</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {menuImages.length === 0 ? (
          <div className="text-gray-500">No menu images available.</div>
        ) : (
          menuImages.map((src, idx) => (
            <div
              key={idx}
              className="cursor-pointer overflow-hidden rounded-lg shadow-sm"
              onClick={() => openAt(idx)}
            >
              <img
                src={src}
                alt={`Menu ${idx + 1}`}
                className="w-full h-40 object-cover transform hover:scale-105 transition"
              />
            </div>
          ))
        )}
      </div>
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <button
            onClick={prev}
            disabled={currentIdx === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white disabled:opacity-30 hover:bg-white/20 rounded-full"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
          <img
            src={menuImages[currentIdx]}
            alt={`Menu ${currentIdx + 1}`}
            className="max-w-full max-h-full rounded-lg"
          />
          <button
            onClick={next}
            disabled={currentIdx === menuImages.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white disabled:opacity-30 hover:bg-white/20 rounded-full"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
          <div className="absolute bottom-4 right-4 text-white text-sm">
            {currentIdx + 1} of {menuImages.length}
          </div>
        </div>
      )}
    </div>
  );
}