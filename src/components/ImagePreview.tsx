import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface ImagePreviewProps {
  imageDataUrl: string;
  onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageDataUrl, onClose }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="p-8 bg-gradient-to-br from-blue-600/80 via-purple-600/80 to-indigo-600/80 backdrop-blur-sm flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">📷 Captured Image</h2>
          <p className="text-blue-100 text-lg">Ready for AI analysis</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-3 rounded-2xl transition-all duration-300 transform hover:scale-110"
        >
          <X size={28} />
        </button>
      </div>
      
      <div className="p-8">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={imageDataUrl}
            alt="Captured food"
            className="w-full h-80 object-cover"
          />
        </div>
        <div className="mt-6 p-4 bg-green-500/10 backdrop-blur-sm rounded-2xl border border-green-400/20">
          <div className="flex items-center space-x-3">
            <Sparkles className="text-green-400" size={20} />
            <p className="text-green-300 font-medium">
              Image captured successfully! AI analysis will begin automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};