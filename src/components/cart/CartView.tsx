import React from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Camera, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Lock,
  Layers,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../data/currencies';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    currency, 
    t, 
    setCheckoutModalOpen, 
    setSelectedProductForTryOn,
    setActiveTab 
  } = useApp();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-stone-900 select-none">
        <div className="w-20 h-20 bg-white border border-stone-200 flex items-center justify-center text-stone-400 mb-4 shadow-xs">
          <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-950">{t.emptyCart}</h2>
        <p className="text-xs text-stone-500 mt-2 max-w-xs leading-relaxed font-mono">
          {t.emptyCartDesc}
        </p>
        <button
          onClick={() => setActiveTab('catalog')}
          className="mt-6 px-8 py-3.5 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-stone-800 shadow-md cursor-pointer"
        >
          <span>{t.exploreBestSellers}</span>
          <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-stone-900 pb-28 select-none">
      {/* Top Header */}
      <div className="bg-white border-b border-stone-200 p-5 sticky top-14 z-20 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold text-stone-950 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <span>{t.cartTitle}</span>
            </h1>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} atelier items configured with precision optics
            </p>
          </div>

          <div className="text-[10px] font-mono font-bold text-stone-800 bg-[#FAF8F5] px-3 py-1.5 border border-stone-300 hidden sm:flex items-center gap-1.5 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>1-Yr Atelier Warranty</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Cart Item Cards */}
        <div className="space-y-3">
          {cart.map((item) => {
            const itemTotal = (item.product.price + (item.lensOption?.price || 0)) * item.quantity;

            return (
              <div
                key={item.id}
                className="p-5 bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between transition-all"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-[#FAF8F5] border border-stone-200 overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute bottom-1.5 right-1.5 w-4 h-4 border border-stone-400 shadow-xs"
                      style={{ backgroundColor: item.color.hex }}
                      title={item.color.name}
                    />
                  </div>

                  {/* Product & Lens Details */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-bold">
                      {item.product.brand} • {item.product.frameShape}
                    </div>
                    <h3 className="font-serif text-base font-bold text-stone-950 leading-tight">
                      {item.product.name}
                    </h3>
                    <div className="text-xs text-stone-600 font-mono">
                      Colorway: <strong className="text-stone-950 font-bold">{item.color.name}</strong>
                    </div>

                    {/* Lens configuration badge */}
                    {item.lensOption ? (
                      <div className="mt-2 p-2.5 bg-[#FAF8F5] border border-stone-200 text-xs space-y-1 max-w-sm">
                        <div className="font-bold text-stone-950 font-mono text-[11px] flex items-center gap-1.5 uppercase">
                          <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{item.lensOption.name} (+{formatPrice(item.lensOption.price, currency)})</span>
                        </div>
                        {item.prescription && (
                          <div className="text-stone-500 text-[10px] font-mono">
                            OD: {item.prescription.rightEye.sph} SPH • OS: {item.prescription.leftEye.sph} SPH • PD: {item.prescription.pd}mm
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-stone-400">
                        Frame Only / Demo Lenses
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Actions & Pricing */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-stone-200 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-base font-bold text-stone-950 font-mono">
                      {formatPrice(itemTotal, currency)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {formatPrice(item.product.price + (item.lensOption?.price || 0), currency)} each
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {/* 3D Try-on shortcut */}
                    <button
                      onClick={() => {
                        setSelectedProductForTryOn(item.product);
                        setActiveTab('tryon');
                      }}
                      className="p-2 bg-[#FAF8F5] hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer"
                      title="Try this on"
                    >
                      <Camera className="w-4 h-4 text-[#D4AF37]" />
                    </button>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-[#FAF8F5] border border-stone-300 p-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-stone-600 hover:text-stone-950 hover:bg-stone-200 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-mono text-stone-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-stone-600 hover:text-stone-950 hover:bg-stone-200 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 bg-[#FAF8F5] hover:bg-red-50 text-stone-400 hover:text-red-700 border border-stone-300 transition-colors cursor-pointer"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY CARD */}
        <div className="p-6 bg-white border border-stone-300 shadow-sm space-y-4">
          <h3 className="font-serif text-sm font-bold text-stone-950 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <span>Order Summary & Guarantees</span>
          </h3>

          <div className="space-y-2.5 text-xs font-mono border-b border-stone-200 pb-4">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-bold text-stone-950">{formatPrice(cartSubtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Insured Luxury Courier:</span>
              <span className="font-bold text-stone-950">COMPLIMENTARY</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>1-Year Scratch & Frame Replacement:</span>
              <span className="font-bold text-[#D4AF37]">INCLUDED</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 text-base font-bold text-stone-950">
            <span className="font-serif">Estimated Total:</span>
            <span className="text-xl text-stone-950 font-mono font-bold">
              {formatPrice(cartSubtotal, currency)}
            </span>
          </div>

          <button
            onClick={() => setCheckoutModalOpen(true)}
            className="w-full py-4 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-800 active:scale-95 shadow-md transition-all cursor-pointer mt-3"
          >
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.checkout}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
