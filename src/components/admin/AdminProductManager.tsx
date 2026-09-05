import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Tag, 
  Layers, 
  Package, 
  Maximize2, 
  Sliders, 
  RefreshCw, 
  DollarSign, 
  Camera, 
  Copy, 
  ChevronRight, 
  X,
  Glasses
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductColor } from '../../types';

const PRESET_STUDIO_IMAGES = [
  { name: 'Hexagonal Titanium Gunmetal', url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80', shape: 'Hexagonal' },
  { name: 'Classic Gold Aviator', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80', shape: 'Aviator' },
  { name: 'Vintage Round Tortoise Acetate', url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80', shape: 'Round' },
  { name: 'Modern Matte Black Wayfarer', url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80', shape: 'Wayfarer' },
  { name: 'Executive Browline Clubmaster', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', shape: 'Clubmaster' },
  { name: 'Polished Black Rectangular', url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80', shape: 'Rectangle' },
  { name: 'Designer Cat-Eye Rose Gold', url: 'https://images.unsplash.com/photo-1509695503492-412db56e87c2?w=800&auto=format&fit=crop&q=80', shape: 'Cat-Eye' },
  { name: 'Minimalist Titanium Rimless', url: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=800&auto=format&fit=crop&q=80', shape: 'Oval' }
];

const POPULAR_BRANDS = [
  'Aman Signature',
  'Aman Titanium Pro',
  'Aman Classic',
  'Ray-Ban',
  'Oakley',
  'Carrera',
  'Gucci Eyewear',
  'Tom Ford Optics',
  'Silhouette Titanium',
  'Prada Linea Rossa',
  'Vogue Eyewear',
  'Police Eyewear'
];

export const AdminProductManager: React.FC = () => {
  const { 
    products, 
    adminAddProduct, 
    adminUpdateProduct, 
    adminDeleteProduct, 
    refreshProducts,
    setSelectedProductForDetail,
    setActiveTab,
    currency 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const initialFormState: Omit<Product, 'id'> & { id?: string } = {
    name: '',
    brand: 'Aman Signature',
    category: 'spectacles',
    gender: 'unisex',
    price: 2499,
    originalPrice: 4499,
    rating: 4.8,
    reviewsCount: 24,
    frameShape: 'Hexagonal',
    frameMaterial: 'Titanium',
    frameType: 'Full Rim',
    weightGrams: 14,
    size: 'Medium',
    dimensions: { lensWidth: 52, bridgeWidth: 18, templeLength: 145 },
    colors: [
      { 
        name: 'Obsidian Black', 
        hex: '#1A202C', 
        frameImg: PRESET_STUDIO_IMAGES[0].url, 
        overlaySvgType: 'hexagonal' 
      }
    ],
    images: [PRESET_STUDIO_IMAGES[0].url],
    description: 'Precision engineered optical grade frame designed for superior daily comfort and crisp optical alignment.',
    features: ['High-Grade Lightweight Frame', 'Comfort Ergonomic Nose-Pads', 'Durable Precision Hinges', 'Zero Pressure Temples'],
    bestForFaceShapes: ['Oval', 'Round', 'Heart'],
    inStock: true,
    isBestSeller: false,
    isNewArrival: true,
    tag: 'New Release'
  };

  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#D4AF37');
  const [newColorImg, setNewColorImg] = useState('');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.frameShape.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.frameMaterial.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategoryFilter === 'all' || product.category === selectedCategoryFilter;
      const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
      const matchesStock = 
        stockFilter === 'all' || 
        (stockFilter === 'in_stock' && product.inStock) || 
        (stockFilter === 'out_of_stock' && !product.inStock);

      return matchesSearch && matchesCat && matchesBrand && matchesStock;
    });
  }, [products, searchTerm, selectedCategoryFilter, brandFilter, stockFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.inStock).length;
    const bestsellers = products.filter(p => p.isBestSeller).length;
    const avgPrice = total > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / total) : 0;
    return { total, inStock, bestsellers, avgPrice };
  }, [products]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    setFormData({
      ...initialFormState,
      id: `aman-frame-${Date.now().toString().slice(-4)}-${randomSuffix}`
    });
    setIsModalOpen(true);
    setNotificationMsg(null);
  };

  // Open Edit Modal
  const handleOpenEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      ...product
    });
    setIsModalOpen(true);
    setNotificationMsg(null);
  };

  // Duplicate Frame
  const handleDuplicateProduct = (product: Product) => {
    setEditingProductId(null);
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    setFormData({
      ...product,
      id: `aman-frame-${Date.now().toString().slice(-4)}-${randomSuffix}`,
      name: `${product.name} (Copy)`,
      isNewArrival: true,
      tag: 'New Edition'
    });
    setIsModalOpen(true);
    setNotificationMsg({ type: 'success', text: `Duplicated specifications for ${product.name}. Adjust and save new listing.` });
  };

  // Toggle In Stock
  const handleToggleStock = async (product: Product) => {
    const updatedStock = !product.inStock;
    await adminUpdateProduct(product.id, { inStock: updatedStock });
  };

  // Delete Confirmation
  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}" (${product.id}) from the catalog? This action cannot be undone.`)) {
      await adminDeleteProduct(product.id);
    }
  };

  // Save Product (Create or Update)
  const handleSubmitProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a valid frame model name.');
      return;
    }

    setIsSaving(true);

    try {
      const productId = editingProductId || formData.id || `aman-frame-${Date.now()}`;
      const productPayload: Product = {
        ...(formData as Product),
        id: productId,
        price: Number(formData.price) || 1999,
        originalPrice: Number(formData.originalPrice) || Number(formData.price) || 2999,
        weightGrams: Number(formData.weightGrams) || 14,
        rating: Number(formData.rating) || 4.8,
        reviewsCount: Number(formData.reviewsCount) || 10,
        dimensions: {
          lensWidth: Number(formData.dimensions?.lensWidth) || 52,
          bridgeWidth: Number(formData.dimensions?.bridgeWidth) || 18,
          templeLength: Number(formData.dimensions?.templeLength) || 145
        },
        images: formData.images && formData.images.length > 0 ? formData.images : [PRESET_STUDIO_IMAGES[0].url],
        colors: formData.colors && formData.colors.length > 0 ? formData.colors : [
          { name: 'Classic Black', hex: '#1A202C', frameImg: formData.images?.[0] || PRESET_STUDIO_IMAGES[0].url, overlaySvgType: 'hexagonal' }
        ]
      };

      if (editingProductId) {
        await adminUpdateProduct(editingProductId, productPayload);
        setNotificationMsg({ type: 'success', text: `Frame "${productPayload.name}" updated successfully in catalog!` });
      } else {
        await adminAddProduct(productPayload);
        setNotificationMsg({ type: 'success', text: `New Frame "${productPayload.name}" is now live on storefront!` });
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setNotificationMsg({ type: 'error', text: 'Error saving product. Please check input parameters.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Add Feature helper
  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeatureInput.trim()]
      }));
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  // Add Image URL helper
  const handleAddImage = () => {
    if (newImageUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImageUrlInput.trim()]
      }));
      setNewImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  // Add Color Swatch helper
  const handleAddColor = () => {
    if (newColorName.trim()) {
      const newColorObj: ProductColor = {
        name: newColorName.trim(),
        hex: newColorHex || '#1A202C',
        frameImg: newColorImg.trim() || formData.images?.[0] || PRESET_STUDIO_IMAGES[0].url,
        overlaySvgType: (formData.frameShape?.toLowerCase() as any) || 'hexagonal'
      };

      setFormData(prev => ({
        ...prev,
        colors: [...(prev.colors || []), newColorObj]
      }));

      setNewColorName('');
      setNewColorImg('');
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter((_, i) => i !== index)
    }));
  };

  // Select Preset Studio Image
  const handleSelectPresetImage = (url: string) => {
    setFormData(prev => {
      const currentImages = prev.images || [];
      if (currentImages.includes(url)) return prev;
      return {
        ...prev,
        images: [url, ...currentImages]
      };
    });
  };

  return (
    <div id="admin-product-catalog-manager" className="space-y-6">
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-stone-900 text-white p-4 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Total Frames</span>
            <p className="text-2xl font-bold font-serif text-white mt-0.5">{stats.total}</p>
          </div>
          <div className="w-10 h-10 bg-stone-800 flex items-center justify-center text-[#D4AF37]">
            <Glasses className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-stone-900 text-white p-4 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Live In-Stock</span>
            <p className="text-2xl font-bold font-serif text-emerald-400 mt-0.5">{stats.inStock}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-stone-900 text-white p-4 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Bestseller Tags</span>
            <p className="text-2xl font-bold font-serif text-[#D4AF37] mt-0.5">{stats.bestsellers}</p>
          </div>
          <div className="w-10 h-10 bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-stone-900 text-white p-4 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Avg Selling Price</span>
            <p className="text-2xl font-bold font-serif text-white mt-0.5">₹{stats.avgPrice.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 bg-stone-800 flex items-center justify-center text-stone-300">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar */}
      <div className="bg-white p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search frames by name, brand, shape, titanium..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category & Stock Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-2.5 py-2 bg-stone-50 border border-stone-300 text-xs font-mono text-stone-800 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Categories</option>
            <option value="spectacles">Spectacles</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="computer_glasses">Computer Glasses</option>
            <option value="reading_glasses">Reading Glasses</option>
            <option value="luxury_titanium">Luxury Titanium</option>
            <option value="kids_eyewear">Kids Eyewear</option>
          </select>

          {/* Stock */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-2.5 py-2 bg-stone-50 border border-stone-300 text-xs font-mono text-stone-800 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Refresh */}
          <button
            onClick={refreshProducts}
            title="Reload from Firestore Database"
            className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* ADD PRODUCT BUTTON */}
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f2f] text-stone-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List New Frame</span>
          </button>
        </div>
      </div>

      {/* 3. Products List / Grid */}
      <div className="bg-white border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Glasses className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="font-serif font-bold text-sm sm:text-base text-stone-900">
              Eyewear Inventory & Product Catalog
            </h2>
            <span className="px-2 py-0.5 bg-stone-200 text-stone-800 font-mono text-[10px] font-bold">
              {filteredProducts.length} Frames
            </span>
          </div>
          <span className="text-[11px] font-mono text-stone-500 hidden sm:inline">
            Direct Storefront & 3D Try-On Synchronized
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto">
              <Glasses className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">No Eyewear Frames Found</h3>
            <p className="text-xs text-stone-500 font-mono max-w-md mx-auto">
              No products match your active search filters. Click the button below to add a new frame listing.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-[#D4AF37] text-stone-950 font-mono font-bold text-xs uppercase inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List First Frame</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredProducts.map((product) => {
              const discountPct = product.originalPrice > product.price 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div 
                  key={product.id} 
                  className="p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-stone-50/80 transition-colors"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Image Box */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-stone-100 border border-stone-200 shrink-0 p-1 flex items-center justify-center relative overflow-hidden group">
                      <img
                        src={product.images?.[0] || PRESET_STUDIO_IMAGES[0].url}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                      {product.isBestSeller && (
                        <span className="absolute top-1 left-1 bg-[#D4AF37] text-stone-950 text-[8px] font-mono font-bold px-1 py-0.2">
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-stone-100 text-stone-700 border border-stone-200">
                          {product.category.replace('_', ' ')}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[10px] font-mono text-stone-500">
                          SKU: <strong className="text-stone-700">{product.id}</strong>
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-stone-950 truncate">
                        {product.name}
                      </h3>

                      <p className="text-xs text-stone-500 line-clamp-1">
                        {product.description}
                      </p>

                      {/* Specs badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono text-stone-600">
                        <span className="px-1.5 py-0.5 bg-stone-100 border border-stone-200">
                          Shape: {product.frameShape}
                        </span>
                        <span className="px-1.5 py-0.5 bg-stone-100 border border-stone-200">
                          Material: {product.frameMaterial}
                        </span>
                        <span className="px-1.5 py-0.5 bg-stone-100 border border-stone-200">
                          Weight: {product.weightGrams}g
                        </span>
                        <span className="px-1.5 py-0.5 bg-stone-100 border border-stone-200">
                          Size: {product.size} ({product.dimensions?.lensWidth}-{product.dimensions?.bridgeWidth}-{product.dimensions?.templeLength})
                        </span>
                        {product.colors && product.colors.length > 0 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-stone-100 border border-stone-200">
                            Colors:
                            <span className="flex -space-x-1">
                              {product.colors.map((c, i) => (
                                <span
                                  key={i}
                                  className="w-2.5 h-2.5 rounded-full border border-white"
                                  style={{ backgroundColor: c.hex }}
                                  title={c.name}
                                />
                              ))}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Pricing & Stock Control */}
                  <div className="flex items-center gap-6 self-end lg:self-center">
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="font-serif font-bold text-lg text-stone-950">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {discountPct > 0 && (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                          {discountPct}% OFF
                        </span>
                      )}
                    </div>

                    {/* In Stock Toggle Switch */}
                    <button
                      onClick={() => handleToggleStock(product)}
                      className={`px-3 py-1.5 text-xs font-mono font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        product.inStock 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                          : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                      }`}
                      title="Click to toggle In-Stock / Out-of-Stock status on storefront"
                    >
                      <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </button>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center border-t lg:border-t-0 pt-2 lg:pt-0 w-full lg:w-auto justify-end">
                    {/* View on Storefront */}
                    <button
                      onClick={() => {
                        setSelectedProductForDetail(product);
                        setActiveTab('home');
                      }}
                      className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                      title="Preview Frame on Live Storefront"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicateProduct(product)}
                      className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                      title="Duplicate this frame to create a new model variant"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Duplicate</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Edit Specs</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs transition-colors cursor-pointer"
                      title="Delete Frame Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. MODAL: ADD / EDIT FRAME LISTING */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-stone-950 text-white border border-stone-800 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Glasses className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                    {editingProductId ? `Edit Frame: ${formData.name}` : 'List New Frame / Sunglasses'}
                  </h2>
                  <p className="text-[11px] font-mono text-stone-400">
                    Live Firestore Catalog Synchronization
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Banner */}
            {notificationMsg && (
              <div className={`p-3 text-xs font-mono flex items-center gap-2 ${
                notificationMsg.type === 'success' ? 'bg-emerald-950 text-emerald-300 border-b border-emerald-800' : 'bg-rose-950 text-rose-300 border-b border-rose-800'
              }`}>
                {notificationMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{notificationMsg.text}</span>
              </div>
            )}

            {/* Modal Form Scrollable Body */}
            <form id="frame-listing-form" onSubmit={handleSubmitProductForm} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
              
              {/* SECTION 1: ESSENTIAL METADATA */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#D4AF37] border-b border-stone-800 pb-1 flex items-center gap-2">
                  <span>1. Frame Identification & Branding</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Model Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Model / Frame Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aman AeroTitanium Hexa-Air"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Brand / Atelier Label *
                    </label>
                    <input
                      type="text"
                      required
                      list="brands-list"
                      placeholder="Aman Signature"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full p-2.5 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <datalist id="brands-list">
                      {POPULAR_BRANDS.map((b) => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full p-2.5 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="spectacles">Spectacles / Prescription</option>
                      <option value="sunglasses">Sunglasses / UV400</option>
                      <option value="computer_glasses">Computer & Screen Glasses</option>
                      <option value="reading_glasses">Reading Glasses</option>
                      <option value="luxury_titanium">Luxury Pure Titanium</option>
                      <option value="kids_eyewear">Kids Flexible Eyewear</option>
                    </select>
                  </div>

                  {/* Target Gender */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Target Audience / Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full p-2.5 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="unisex">Unisex (All Genders)</option>
                      <option value="men">Men's Collection</option>
                      <option value="women">Women's Collection</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>

                  {/* SKU / Product ID */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Product SKU / Unique ID
                    </label>
                    <input
                      type="text"
                      disabled={!!editingProductId}
                      placeholder="e.g. aman-titan-09"
                      value={formData.id || ''}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full p-2.5 bg-stone-900 border border-stone-700 text-stone-400 disabled:opacity-50 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING & INVENTORY */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#D4AF37] border-b border-stone-800 pb-1 flex items-center gap-2">
                  <span>2. Pricing & Commercials (INR)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Selling Price */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-stone-900 border border-stone-700 text-white font-bold text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Original Price / MRP */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Original MRP (₹)
                    </label>
                    <input
                      type="number"
                      min="100"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full p-2.5 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Computed Discount Preview */}
                  <div className="bg-stone-900 p-2.5 border border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">Discount Offered:</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {formData.originalPrice > formData.price 
                        ? `${Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% Discount` 
                        : 'None (MRP)'}
                    </span>
                  </div>
                </div>

                {/* Badges & Merchandising */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <label className="flex items-center gap-2 p-2.5 bg-stone-900 border border-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[11px] text-stone-200">Active In-Stock</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-stone-900 border border-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[11px] text-stone-200">Bestseller Badge</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-stone-900 border border-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[11px] text-stone-200">New Arrival Badge</span>
                  </label>

                  <div>
                    <input
                      type="text"
                      placeholder="Tag (e.g. Bestseller, Limited)"
                      value={formData.tag || ''}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      className="w-full p-2 bg-stone-900 border border-stone-800 text-[11px] text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: FRAME SPECIFICATIONS */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#D4AF37] border-b border-stone-800 pb-1 flex items-center gap-2">
                  <span>3. Optical Ergonomics & Frame Specs</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Shape */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Frame Shape *</label>
                    <select
                      value={formData.frameShape}
                      onChange={(e) => setFormData({ ...formData, frameShape: e.target.value as any })}
                      className="w-full p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Hexagonal">Hexagonal</option>
                      <option value="Aviator">Aviator</option>
                      <option value="Round">Round</option>
                      <option value="Rectangle">Rectangle</option>
                      <option value="Wayfarer">Wayfarer</option>
                      <option value="Cat-Eye">Cat-Eye</option>
                      <option value="Clubmaster">Clubmaster</option>
                      <option value="Oval">Oval</option>
                      <option value="Geometric">Geometric</option>
                      <option value="Square">Square</option>
                    </select>
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Material *</label>
                    <select
                      value={formData.frameMaterial}
                      onChange={(e) => setFormData({ ...formData, frameMaterial: e.target.value as any })}
                      className="w-full p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Titanium">Japanese Pure Titanium</option>
                      <option value="Acetate">Italian Mazzucchelli Acetate</option>
                      <option value="Stainless Steel">Surgical Stainless Steel</option>
                      <option value="TR90">TR90 Ultra-Flexible</option>
                      <option value="Alloy">Lightweight Metal Alloy</option>
                      <option value="Carbon Fiber">Carbon Fiber Pro</option>
                    </select>
                  </div>

                  {/* Rim Type */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Rim Style</label>
                    <select
                      value={formData.frameType}
                      onChange={(e) => setFormData({ ...formData, frameType: e.target.value as any })}
                      className="w-full p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Full Rim">Full Rim</option>
                      <option value="Half Rim">Half Rim (Supra)</option>
                      <option value="Rimless">Rimless (Minimalist)</option>
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Fit Size</label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                      className="w-full p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Narrow">Narrow (Small Faces)</option>
                      <option value="Medium">Medium (Universal)</option>
                      <option value="Wide">Wide (Broad Fit)</option>
                    </select>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Weight (Grams)</label>
                    <input
                      type="number"
                      value={formData.weightGrams}
                      onChange={(e) => setFormData({ ...formData, weightGrams: Number(e.target.value) })}
                      className="w-full p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Lens Width */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Lens Width (mm)</label>
                    <input
                      type="number"
                      value={formData.dimensions?.lensWidth || 52}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        dimensions: { ...formData.dimensions, lensWidth: Number(e.target.value) } as any 
                      })}
                      className="w-full p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Bridge Width */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Bridge (mm)</label>
                    <input
                      type="number"
                      value={formData.dimensions?.bridgeWidth || 18}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        dimensions: { ...formData.dimensions, bridgeWidth: Number(e.target.value) } as any 
                      })}
                      className="w-full p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Temple Length */}
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Temple (mm)</label>
                    <input
                      type="number"
                      value={formData.dimensions?.templeLength || 145}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        dimensions: { ...formData.dimensions, templeLength: Number(e.target.value) } as any 
                      })}
                      className="w-full p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: PRODUCT IMAGES & STUDIO PRESETS */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#D4AF37] border-b border-stone-800 pb-1 flex items-center justify-between">
                  <span>4. High-Resolution Product Images & Studio Presets</span>
                  <span className="text-[10px] text-stone-400">Click preset to add instantly</span>
                </h3>

                {/* Preset Studio Library */}
                <div className="p-3 bg-stone-900 border border-stone-800 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                    Quick Optical Studio Asset Selector:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_STUDIO_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleSelectPresetImage(preset.url)}
                        className="aspect-square bg-stone-950 border border-stone-700 hover:border-[#D4AF37] p-1 group relative transition-all"
                        title={`Add ${preset.name}`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute inset-0 bg-[#D4AF37]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] font-bold text-white">
                          + Add
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Image URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste any custom image URL (https://...)"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    className="flex-1 p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold cursor-pointer"
                  >
                    Add Image
                  </button>
                </div>

                {/* Current Active Image Gallery */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {formData.images?.map((imgUrl, i) => (
                    <div key={i} className="w-20 h-20 bg-stone-900 border border-stone-700 relative group p-1">
                      <img
                        src={imgUrl}
                        alt={`Preview ${i}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-rose-700"
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: COLOR VARIANTS & SWATCHES */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#D4AF37] border-b border-stone-800 pb-1 flex items-center gap-2">
                  <span>5. Color Variants & Virtual Try-On Swatches</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-stone-900 p-3 border border-stone-800">
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Color Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Gunmetal Grey"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className="w-full p-2 bg-stone-950 border border-stone-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Hex Color</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-10 h-8 p-0 bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="flex-1 p-2 bg-stone-950 border border-stone-700 text-white uppercase text-[11px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Variant Image URL</label>
                    <input
                      type="url"
                      placeholder="Optional image URL..."
                      value={newColorImg}
                      onChange={(e) => setNewColorImg(e.target.value)}
                      className="w-full p-2 bg-stone-950 border border-stone-700 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="w-full py-2 bg-[#D4AF37] hover:bg-[#c49f2f] text-stone-950 font-bold text-xs"
                    >
                      + Add Swatch
                    </button>
                  </div>
                </div>

                {/* Active Swatches List */}
                <div className="flex flex-wrap gap-2">
                  {formData.colors?.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 bg-stone-900 border border-stone-700 text-xs">
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-500" style={{ backgroundColor: c.hex }} />
                      <span className="text-stone-200">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(i)}
                        className="text-stone-400 hover:text-rose-400 text-xs font-bold ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: DESCRIPTION & KEY HIGHLIGHTS */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#D4AF37] border-b border-stone-800 pb-1 flex items-center gap-2">
                  <span>6. Product Story & Selling Highlights</span>
                </h3>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    Storefront Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Features / Highlights */}
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    Key Features / Bullet Points
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. Memory Flex Hinge System"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      className="flex-1 p-2 bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold"
                    >
                      Add Feature
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {formData.features?.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
                        <span>• {f}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(i)}
                          className="text-stone-500 hover:text-rose-400 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-900 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="frame-listing-form"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2f] text-stone-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                    <span>Syncing Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-stone-950" />
                    <span>{editingProductId ? 'Update Frame Listing' : 'Publish Frame to Store'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
