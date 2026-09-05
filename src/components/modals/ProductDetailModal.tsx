import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  RotateCw, 
  ChevronRight, 
  Layers, 
  Check, 
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductColor } from '../../types';
import { formatPrice } from '../../data/currencies';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductForDetail, 
    setSelectedProductForDetail, 
    setSelectedProductForTryOn, 
    setSelectedProductForLensConfig,
    addToCart, 
    wishlist, 
    addToWishlist, 
    removeFromWishlist, 
    currency, 
    t, 
    setActiveTab 
  } = useApp();

  const product = selectedProductForDetail;
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    return product ? product.colors[0] : { name: 'Black', hex: '#000', frameImg: '', overlaySvgType: 'wayfarer' };
  });

  const [rotAngle, setRotAngle] = useState(0);

  if (!product) return null;

  const isFavorited = wishlist.some(p => p.id === product.id);

  const handleLaunchTryOn = () => {
    setSelectedProductForTryOn(product);
    setSelectedProductForDetail(null);
    setActiveTab('tryon');
  };

  const handleLaunchLensCustomizer = () => {
    setSelectedProductForLensConfig(product);
    setSelectedProductForDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in select-none">
      <div 
        id="product-detail-modal-container"
        className="bg-white border border-stone-300 max-w-2xl w-full my-auto shadow-2xl text-stone-900 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top bar */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-900 font-mono font-bold uppercase tracking-widest">
            <span className="text-[#D4AF37]">●</span>
            <span>{product.brand} — {product.category.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isFavorited) removeFromWishlist(product.id);
                else addToWishlist(product);
              }}
              className={`p-2 border transition-colors cursor-pointer ${
                isFavorited ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white border-stone-300 text-stone-600 hover:text-stone-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={() => setSelectedProductForDetail(null)}
              className="p-2 bg-white border border-stone-300 text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Main Visual & Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] bg-[#FAF8F5] overflow-hidden border border-stone-200 flex items-center justify-center group">
              <img
                src={product.images[selectedImgIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: `rotateY(${rotAngle}deg)` }}
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.isBestSeller && (
                  <span className="px-2.5 py-1 bg-stone-950 text-white text-[9px] font-mono font-bold uppercase tracking-widest border border-stone-800">
                    ★ Iconic Best Seller
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-white/95 text-stone-900 text-[10px] font-mono font-bold border border-stone-300">
                  {product.frameShape}
                </span>
              </div>

              {/* 360 rotation slider button */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-3 py-1.5 border border-stone-300 text-xs text-stone-800 font-mono">
                <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[10px] uppercase font-bold">Angle:</span>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={rotAngle}
                  onChange={(e) => setRotAngle(parseInt(e.target.value))}
                  className="w-16 accent-stone-950 bg-stone-200 h-1.5 ml-1 cursor-pointer"
                />
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImgIndex(i)}
                  className={`w-16 h-14 overflow-hidden border transition-all cursor-pointer ${
                    selectedImgIndex === i
                      ? 'border-stone-950 ring-2 ring-stone-950/20'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title & Price */}
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-stone-950 leading-tight">
              {product.name}
            </h2>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-2xl font-bold text-stone-950">
                {formatPrice(product.price, currency)}
              </span>
              <span className="font-mono text-sm text-stone-400 line-through">
                {formatPrice(product.originalPrice, currency)}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] bg-[#FAF8F5] px-2 py-0.5 border border-stone-300 uppercase">
                Save {formatPrice(product.originalPrice - product.price, currency)}
              </span>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 text-xs text-stone-600 font-mono">
              <div className="flex items-center text-[#D4AF37]">
                <Star className="w-4 h-4 fill-[#D4AF37]" />
                <span className="font-bold ml-1 text-stone-900">{product.rating}</span>
              </div>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500">({product.reviewsCount} verified reviews)</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
              Frame Finish: <strong className="text-stone-950">{selectedColor.name}</strong>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono uppercase transition-all cursor-pointer ${
                    selectedColor.name === c.name
                      ? 'bg-stone-950 text-white border-stone-950'
                      : 'bg-[#FAF8F5] border-stone-300 text-stone-700 hover:text-stone-950'
                  }`}
                >
                  <span
                    className="w-3 h-3 border border-stone-400"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frame Dimensions & Specs Matrix */}
          <div className="p-4 bg-[#FAF8F5] border border-stone-200 space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Optical Dimensions & Fit Specs:</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-white border border-stone-200">
                <div className="text-[9px] font-mono text-stone-400 uppercase font-bold">Lens Width</div>
                <div className="font-mono font-bold text-stone-950 mt-0.5">{product.dimensions.lensWidth} mm</div>
              </div>
              <div className="p-2.5 bg-white border border-stone-200">
                <div className="text-[9px] font-mono text-stone-400 uppercase font-bold">Bridge Width</div>
                <div className="font-mono font-bold text-stone-950 mt-0.5">{product.dimensions.bridgeWidth} mm</div>
              </div>
              <div className="p-2.5 bg-white border border-stone-200">
                <div className="text-[9px] font-mono text-stone-400 uppercase font-bold">Temple Length</div>
                <div className="font-mono font-bold text-stone-950 mt-0.5">{product.dimensions.templeLength} mm</div>
              </div>
              <div className="p-2.5 bg-white border border-stone-200">
                <div className="text-[9px] font-mono text-stone-400 uppercase font-bold">Frame Weight</div>
                <div className="font-mono font-bold text-stone-950 mt-0.5">{product.weightGrams} grams</div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-stone-500 pt-1 flex items-center justify-between border-t border-stone-200">
              <span>Best for Face Shapes: <strong className="text-stone-950">{product.bestForFaceShapes.join(', ')}</strong></span>
              <span>Material: <strong className="text-stone-950">{product.frameMaterial}</strong></span>
            </div>
          </div>

          {/* Customer Reviews Spotlight */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
              Verified Patron Testimonials ({(product.reviews || []).length}):
            </h4>
            <div className="space-y-2">
              {(product.reviews || []).map((rev, idx) => (
                <div key={idx} className="p-3 bg-[#FAF8F5] border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-stone-950">{rev.author}</span>
                    <div className="flex items-center text-[#D4AF37]">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 text-[11px] font-sans">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={handleLaunchTryOn}
            className="flex-1 py-3 px-4 bg-white hover:bg-stone-100 text-stone-950 font-mono font-bold text-xs uppercase tracking-wider border border-stone-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Camera className="w-4 h-4 text-[#D4AF37]" />
            <span>3D Live Try-On</span>
          </button>

          <button
            onClick={handleLaunchLensCustomizer}
            className="flex-1 py-3 px-4 bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>Configure & Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
