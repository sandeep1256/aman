import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Grid, 
  List, 
  Camera, 
  Heart, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Layers,
  Search,
  Database,
  Sun,
  Glasses
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FrameShape, Product, ProductCategory } from '../../types';
import { formatPrice } from '../../data/currencies';

export const CatalogView: React.FC = () => {
  const { 
    products,
    categories,
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    setSelectedProductForDetail,
    setSelectedProductForTryOn,
    setSelectedProductForLensConfig,
    addToCart,
    wishlist,
    toggleWishlist,
    isInWishlist,
    currency,
    t,
    setActiveTab,
    dbSyncStatus
  } = useApp();

  // Local filter states
  const [selectedFrameShape, setSelectedFrameShape] = useState<FrameShape | 'all'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'unisex' | 'men' | 'women'>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating'>('popular');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState<boolean>(false);

  // Frame Shape Chips
  const frameShapesList: { shape: FrameShape | 'all'; label: string }[] = [
    { shape: 'all', label: 'All Shapes' },
    { shape: 'Aviator', label: 'Aviator' },
    { shape: 'Wayfarer', label: 'Wayfarer' },
    { shape: 'Hexagonal', label: 'Hexagonal' },
    { shape: 'Round', label: 'Round' },
    { shape: 'Cat-Eye', label: 'Cat-Eye' },
    { shape: 'Square', label: 'Square' },
    { shape: 'Browline', label: 'Browline' },
    { shape: 'Rectangle', label: 'Rectangle' },
    { shape: 'Oval', label: 'Oval' }
  ];

  // Category Tabs
  const categoriesList: { id: ProductCategory; label: string; icon?: any }[] = [
    { id: 'all', label: 'All Eyewear' },
    { id: 'sunglasses', label: 'Sunglasses & Polarized', icon: Sun },
    { id: 'spectacles', label: 'Spectacles', icon: Glasses },
    { id: 'computer_bluecut', label: 'Blue-Cut Screen' },
    { id: 'reading', label: 'Reading & Rimless' },
    { id: 'sports', label: 'Sports & Active' },
    { id: 'kids', label: 'Kids Flex' }
  ];

  // Materials List
  const materialsList = ['all', 'Titanium', 'Italian Acetate', 'TR-90 Flexible', 'Stainless Steel'];

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Frame Shape
      if (selectedFrameShape !== 'all' && p.frameShape !== selectedFrameShape) return false;

      // Gender
      if (selectedGender !== 'all' && p.gender !== selectedGender && p.gender !== 'unisex') return false;

      // Material
      if (selectedMaterial !== 'all' && !p.frameMaterial.toLowerCase().includes(selectedMaterial.toLowerCase())) return false;

      // Max Price
      if (p.price > maxPrice) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchShape = p.frameShape.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchShape && !matchDesc && !matchCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, selectedCategory, selectedFrameShape, selectedGender, selectedMaterial, maxPrice, searchQuery, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFrameShape('all');
    setSelectedGender('all');
    setSelectedMaterial('all');
    setMaxPrice(10000);
    setSearchQuery('');
  };

  const activeCategoryInfo = categories.find(c => c.slug === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-stone-900 pb-28 select-none">
      {/* Top Category Sticky Navigation */}
      <div className="bg-white border-b border-stone-200 p-3 sm:p-4 sticky top-14 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Categories Tab Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-600 hover:bg-stone-100 hover:text-stone-950 border border-stone-200'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D4AF37]' : 'text-stone-400'}`} />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Frame Shape Icon Chips */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {frameShapesList.map((fs) => (
                <button
                  key={fs.shape}
                  onClick={() => setSelectedFrameShape(fs.shape)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                    selectedFrameShape === fs.shape
                      ? 'bg-stone-900 text-[#D4AF37] border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {fs.label}
                </button>
              ))}
            </div>

            {/* Filter Drawer Toggle & Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowFiltersDrawer(true)}
                className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-stone-100 text-stone-800 border border-stone-300 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-300 px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-stone-900 font-bold uppercase tracking-wider cursor-pointer"
              >
                <option value="popular">Best Sellers</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Banner Highlight when specific category selected */}
      {selectedCategory === 'sunglasses' && (
        <div className="bg-stone-950 text-white border-b border-stone-800 px-4 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#D4AF37] font-mono text-[10px] uppercase font-bold tracking-widest">
                <Sun className="w-4 h-4" />
                <span>Designer Sunglasses & Polarized Optics</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                100% UV400 Precision Polarized Sun Collection
              </h2>
              <p className="text-xs text-stone-400 font-mono max-w-2xl">
                Engineered with Category 3 & 4 optical filters, aerospace titanium, and handcrafted Italian acetate to eliminate road glare and water reflections.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-300">
              <Database className="w-3 h-3 text-[#D4AF37]" />
              <span>Database Synced ({filteredProducts.length} Models)</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content & Products Grid */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Results Summary Bar */}
        <div className="flex items-center justify-between py-2 mb-4 border-b border-stone-200 text-xs text-stone-500 font-mono">
          <div className="flex items-center gap-2">
            <span>
              SHOWING <strong className="text-stone-950 font-bold">{filteredProducts.length}</strong> ARCHITECTURAL STYLES
              {searchQuery && <span> FOR "<strong className="text-stone-950">{searchQuery}</strong>"</span>}
            </span>
            <span className="hidden sm:inline text-stone-300">|</span>
            <span className="hidden sm:inline text-[10px] text-emerald-700">Firestore Catalog Active</span>
          </div>

          {(selectedCategory !== 'all' || selectedFrameShape !== 'all' || selectedGender !== 'all' || selectedMaterial !== 'all' || searchQuery) && (
            <button
              onClick={resetAllFilters}
              className="text-stone-900 hover:text-stone-600 flex items-center gap-1 font-bold uppercase tracking-widest cursor-pointer text-[10px]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white border border-stone-200 space-y-4">
            <Filter className="w-10 h-10 mx-auto text-stone-400" />
            <h3 className="font-serif text-xl font-normal text-stone-950">No Silhouettes Matched</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto font-mono">
              Try adjusting your sunglasses or category filters or search keywords.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isFav = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white border border-stone-200 hover:border-stone-900 transition-all flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Frame Image & Action Overlays */}
                    <div 
                      onClick={() => setSelectedProductForDetail(product)}
                      className="relative aspect-[4/3] bg-[#FAF8F5] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Best Seller / New Badge */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.category === 'sunglasses' && (
                          <span className="px-2 py-0.5 bg-amber-500 text-stone-950 text-[9px] font-mono uppercase tracking-widest font-bold">
                            POLARIZED SUN
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 py-0.5 bg-stone-950 text-white text-[9px] font-mono uppercase tracking-widest font-bold">
                            ATELIER
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-white/90 text-stone-700 text-[9px] font-mono uppercase font-bold border border-stone-200">
                          {product.frameShape}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-2 right-2 p-2 border transition-colors cursor-pointer ${
                          isFav ? 'bg-white text-rose-600 border-stone-900' : 'bg-white/80 text-stone-400 hover:text-stone-950 border-stone-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600' : ''}`} />
                      </button>

                      {/* Color Swatches Pill */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 px-2 py-0.5 border border-stone-200">
                        {product.colors.map((c) => (
                          <span
                            key={c.name}
                            className="w-2.5 h-2.5 border border-stone-300 shadow-xs"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Frame Info */}
                    <div 
                      onClick={() => setSelectedProductForDetail(product)}
                      className="p-4 space-y-1.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                        <span className="font-bold uppercase tracking-wider">{product.brand}</span>
                        <div className="flex items-center text-stone-700 font-bold">
                          <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                          <span className="ml-1">{product.rating}</span>
                        </div>
                      </div>

                      <h4 className="font-serif text-base font-bold text-stone-950 truncate leading-tight group-hover:text-stone-700 transition-colors">
                        {product.name}
                      </h4>

                      <div className="text-[10px] text-stone-500 truncate font-mono">
                        {product.frameMaterial} • {product.weightGrams}g
                      </div>

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

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    {/* 3D AR Try-On Button */}
                    <button
                      onClick={() => {
                        setSelectedProductForTryOn(product);
                        setActiveTab('tryon');
                      }}
                      className="flex-1 py-2.5 px-2 bg-[#F5F2ED] hover:bg-stone-200 text-stone-900 font-bold text-[10px] uppercase tracking-widest border border-stone-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Virtual Try-On"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>3D Try-On</span>
                    </button>

                    {/* Select Lenses / Buy */}
                    <button
                      onClick={() => {
                        setSelectedProductForLensConfig(product);
                      }}
                      className="py-2.5 px-3.5 bg-stone-950 hover:bg-stone-800 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                      title="Configure Lenses & Order"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FILTER DRAWER SLIDE-OVER */}
      {showFiltersDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs sm:max-w-sm bg-white border-l border-stone-200 h-full p-6 flex flex-col justify-between shadow-2xl text-stone-900 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif text-lg font-bold text-stone-950 uppercase tracking-tight">Refine Catalogue</h3>
                </div>
                <button
                  onClick={() => setShowFiltersDrawer(false)}
                  className="p-2 border border-stone-200 text-stone-400 hover:text-stone-950 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'men', 'women'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`py-2 text-[10px] uppercase font-bold tracking-wider transition-colors border cursor-pointer ${
                        selectedGender === g ? 'bg-stone-950 text-white border-stone-950' : 'bg-[#FAF8F5] text-stone-600 border-stone-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Material */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">Frame Material</label>
                <div className="space-y-1.5">
                  {materialsList.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-between border cursor-pointer ${
                        selectedMaterial === mat ? 'bg-stone-950 text-[#D4AF37] border-stone-950 font-bold' : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span>{mat === 'all' ? 'All Materials' : mat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-600 font-mono">
                  <span className="font-bold uppercase tracking-widest">Price Limit</span>
                  <span className="text-stone-950 font-bold">{formatPrice(maxPrice, currency)}</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-stone-950 bg-stone-200 h-1.5 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2 mt-4">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-3 bg-[#FAF8F5] hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFiltersDrawer(false)}
                className="flex-1 py-3 bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 shadow-md cursor-pointer"
              >
                Apply Refinement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
