"use client";
import { useState } from "react";
import Image from "next/image";

interface CarGalleryProps {
  images: string[];
  title: string;
}

export default function CarGallery({ images, title }: CarGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const hasImages = Array.isArray(images) && images.length > 0;

  return (
    <div className="gallery-stack">
      {/* Main Image */}
      <div
        className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden ${hasImages ? 'bg-white group cursor-pointer' : 'bg-[#141414] border border-[#2a2a2a] flex items-center justify-center text-white/50'}`}
        onClick={() => hasImages && setIsFullscreen(true)}
      >
        {hasImages ? (
          <Image 
            src={images[selectedImage]} 
            alt={`${title} - фото ${selectedImage + 1}`} 
            fill 
            className="object-contain group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="text-center">
            <div className="text-sm">Нет фотографий</div>
          </div>
        )}
        
        {/* Navigation Arrows */}
        {hasImages && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        )}
        
        {hasImages && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        )}

        {/* Fullscreen Button */}
        {hasImages && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(true);
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        )}

        {/* Image Counter */}
        {hasImages && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {selectedImage + 1} / {images.length}
        </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {hasImages && (
      <div className="thumbs-grid">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-full aspect-square rounded-lg overflow-hidden bg-white transition-all duration-300 ${
              selectedImage === index 
                ? 'ring-2 ring-[#C8BF2F] scale-105' 
                : 'hover:scale-105 opacity-80 hover:opacity-100'
            }`}
          >
            <Image src={image} alt={`${title} - миниатюра ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
      )}

      {/* Removed 'Показать все фото' per request */}

      {/* Fullscreen Modal */}
      {isFullscreen && hasImages && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image 
              src={images[selectedImage]} 
              alt={`${title} - полноэкранное фото ${selectedImage + 1}`} 
              fill 
              className="object-contain" 
            />
            
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation in Fullscreen */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter in Fullscreen */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
