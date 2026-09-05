import React from 'react';
import { 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Award, 
  ArrowRight, 
  Star, 
  Layers, 
  Glasses, 
  Eye, 
  CheckCircle2,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';
import { FaceShape, ProductCategory } from '../../types';
import { formatPrice } from '../../data/currencies';

export const HomeView: React.FC = () => {
  const { 
    setSelectedCategory, 
    setSelectedFrameShape, 
    setSelectedProductForDetail, 
    setSelectedProductForTryOn, 
    currency, 
    t, 
    setActiveTab 
  } = useApp();

  const bestSellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  const faceShapes: { shape: FaceShape; desc: string; icon: string }[] = [
    { shape: 'Oval', desc: 'Versatile geometry', icon: '⬭' },
    { shape: 'Square', desc: 'Round & Aviators', icon: '▢' },
    { shape: 'Round', desc: 'Square & Hexagonal', icon: '◯' },
    { shape: 'Heart', desc: 'Browline & Oval', icon: '♡' },
    { shape: 'Diamond', desc: 'Cat-Eye & Rimless', icon: '◇' },
    { shape: 'Oblong', desc: 'Wide Wayfarer', icon: '▭' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-stone-900 pb-28 select-none">
      {/* 1. HERO SECTION (Geometric Balance Showcase) */}
      <section className="px-4 py-8 sm:py-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-500 font-bold">
                ESTABLISHED 1998 • ATELIER
              </span>
              <span className="w-8 h-[1px] bg-stone-300"></span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                JAPANESE TITANIUM
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-stone-950 leading-[1.1]">
              Architectural <br />
              <span className="italic font-light">Precision Optics</span> & <br />
              Luxury Eyewear
            </h1>

            <p className="text-stone-600 text-sm sm:text-base max-w-xl leading-relaxed font-sans">
              Handcrafted silhouettes engineered with aerospace-grade Japanese titanium, high-index anti-glare coatings, and real-time 3D facial geometry try-on.
            </p>

            {/* Geometric CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="hero-tryon-cta"
                onClick={() => {
                  setSelectedProductForTryOn(PRODUCTS[0]);
                  setActiveTab('tryon');
                }}
                className="px-8 py-4 bg-stone-950 text-white font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-stone-800 transition-all cursor-pointer shadow-md group"
              >
                <Camera className="w-4 h-4 text-[#D4AF37]" />
                <span>Launch 3D Virtual Try-On</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-stylist-cta"
                onClick={() => setActiveTab('stylist')}
                className="px-6 py-4 bg-white border border-stone-300 text-stone-800 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:border-stone-950 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>AI Facial Advisor</span>
              </button>
            </div>

            {/* Micro Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 text-[10px] text-stone-500 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-900" />
                <span>1-Yr Zero Scratch</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-stone-900" />
                <span>Laser Surfaced</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-900" />
                <span>Express Courier</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Eyewear Showcase Card with Geometric Reticles */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white border border-stone-300 p-6 shadow-sm reticle-corner-tl reticle-corner-br">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                  MODEL SERIES / 2024
                </span>
                <span className="px-2 py-0.5 bg-[#F5F2ED] text-stone-800 text-[9px] font-mono uppercase font-bold border border-stone-200">
                  FLAGSHIP
                </span>
              </div>

              <div className="aspect-[4/3] bg-[#FAF8F5] relative overflow-hidden flex items-center justify-center mb-6 group">
                <img
                  src={PRODUCTS[0].images[0]}
                  alt={PRODUCTS[0].name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button
                  onClick={() => {
                    setSelectedProductForTryOn(PRODUCTS[0]);
                    setActiveTab('tryon');
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-stone-950 text-white text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 shadow-md"
                >
                  <Camera className="w-3 h-3 text-[#D4AF37]" />
                  <span>3D Mirror</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-xl text-stone-950 font-bold uppercase tracking-tight">
                    {PRODUCTS[0].name}
                  </h3>
                  <span className="font-mono text-base font-bold text-stone-900">
                    {formatPrice(PRODUCTS[0].price, currency)}
                  </span>
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {PRODUCTS[0].description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-stone-600 font-mono">
                  <span className="text-[#D4AF37]">★★★★★</span>
                  <span>4.9 (428 Reviews)</span>
                </div>
                <button
                  onClick={() => setSelectedProductForDetail(PRODUCTS[0])}
                  className="text-[10px] uppercase tracking-widest font-bold text-stone-900 hover:underline cursor-pointer"
                >
                  Inspect Specifications →
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY TILES GRID (Architectural Quadrant) */}
      <section className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
              CURATED SILHOUETTES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
              Eyewear Collections
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('catalog');
            }}
            className="text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Archive</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'spectacles' as ProductCategory,
              title: 'Prescription Optics',
              tag: 'Single Vision & Multi-Focal',
              img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: 'sunglasses' as ProductCategory,
              title: 'Designer Sunglasses',
              tag: 'Polarized UV400 Dark',
              img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: 'blue_light' as ProductCategory,
              title: 'Blue-Shield 420nm',
              tag: 'Digital Screen Filter',
              img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: 'progressive' as ProductCategory,
              title: 'No-Line Progressive',
              tag: 'Seamless Near + Far Corridor',
              img: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80'
            }
          ].map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveTab('catalog');
              }}
              className="group bg-white border border-stone-200 overflow-hidden cursor-pointer shadow-xs hover:border-stone-900 transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute top-3 right-3 w-6 h-6 bg-white/90 border border-stone-200 flex items-center justify-center text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div className="p-4 bg-white space-y-1">
                <div className="text-[9px] uppercase font-mono tracking-widest text-[#D4AF37] font-bold">
                  {cat.tag}
                </div>
                <h3 className="font-serif text-base font-bold text-stone-950 uppercase tracking-tight">
                  {cat.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FACE SHAPE ADVISOR STRIP (Clean Geometric Layout) */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="p-6 sm:p-8 bg-white border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                <Eye className="w-3.5 h-3.5" />
                <span>FACIAL TOPOGRAPHY MATRIX</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-950 mt-1">
                Find Frames Matched to Your Face Shape
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('stylist')}
              className="px-5 py-2.5 bg-stone-950 text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <span>Scan Face with AI</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {faceShapes.map((fs) => (
              <button
                key={fs.shape}
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveTab('catalog');
                }}
                className="p-4 bg-[#FAF8F5] hover:bg-white border border-stone-200 hover:border-stone-900 transition-all text-center cursor-pointer group flex flex-col items-center justify-center"
              >
                <div className="text-3xl mb-2 text-stone-800 group-hover:scale-110 group-hover:text-[#D4AF37] transition-all">
                  {fs.icon}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-900">{fs.shape}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">{fs.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS CURATED GRID */}
      <section className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
              ATELIER SELECTIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
              Most Requested Silhouettes
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('catalog');
            }}
            className="text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All ({PRODUCTS.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-stone-200 hover:border-stone-900 transition-all flex flex-col justify-between overflow-hidden group shadow-xs"
            >
              <div 
                onClick={() => setSelectedProductForDetail(product)}
                className="cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-[#FAF8F5] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-stone-950 text-white text-[9px] font-mono uppercase tracking-widest font-bold">
                    ATELIER
                  </span>
                  <span className="absolute bottom-2 left-2 text-[9px] font-mono uppercase font-bold text-stone-700 bg-white/90 px-2 py-0.5 border border-stone-200">
                    {product.frameShape}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 font-mono font-semibold">
                    {product.brand}
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-950 truncate leading-tight group-hover:text-stone-700">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 pt-1 font-mono">
                    <span className="text-sm font-bold text-stone-950">
                      {formatPrice(product.price, currency)}
                    </span>
                    <span className="text-[11px] text-stone-400 line-through">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProductForTryOn(product);
                    setActiveTab('tryon');
                  }}
                  className="flex-1 py-2.5 bg-stone-950 text-white hover:bg-stone-800 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>3D Try-On</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HERITAGE & CRAFTSMANSHIP BANNER */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-8 sm:p-12 bg-white border border-stone-200 text-center space-y-6">
          <div className="w-12 h-12 bg-[#F5F2ED] border border-stone-300 text-stone-950 flex items-center justify-center mx-auto">
            <Glasses className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
              AMAN OPTICALS WORKSHOP
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950">
              Master Craftsmanship & Lifetime Assurance
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
              Every spectacle and sunglasses pair is manufactured to exact ophthalmic tolerances, hand-finished in our optical lab, and verified with computerized digital lens surfacing.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-2 text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700">
            <span className="px-4 py-1.5 bg-[#FAF8F5] border border-stone-200">✓ 1-Year Scratch Replacement</span>
            <span className="px-4 py-1.5 bg-[#FAF8F5] border border-stone-200">✓ Optometrist Prescribed</span>
            <span className="px-4 py-1.5 bg-[#FAF8F5] border border-stone-200">✓ 14-Day Global Returns</span>
          </div>
        </div>
      </section>
    </div>
  );
};
