import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Upload, 
  ChevronRight, 
  ShoppingBag,
  Layers,
  Sun,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LENS_OPTIONS } from '../../data/lenses';
import { LensOption, ProductColor, Prescription } from '../../types';
import { formatPrice } from '../../data/currencies';

export const LensCustomizerModal: React.FC = () => {
  const { 
    selectedProductForLensConfig, 
    setSelectedProductForLensConfig, 
    addToCart, 
    t, 
    currency, 
    prescriptions,
    setPdToolModalOpen,
    setActiveTab
  } = useApp();

  const product = selectedProductForLensConfig;

  // Selected Color
  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    return product ? product.colors[0] : { name: 'Black', hex: '#000', frameImg: '', overlaySvgType: 'wayfarer' };
  });

  // Selected Lens Option
  const [selectedLens, setSelectedLens] = useState<LensOption>(LENS_OPTIONS[0]);

  // Prescription Form Mode: 'manual' | 'upload' | 'saved'
  const [prescriptionMode, setPrescriptionMode] = useState<'manual' | 'upload' | 'saved'>('manual');

  // Manual Power Values
  const [rightSph, setRightSph] = useState('-1.25');
  const [rightCyl, setRightCyl] = useState('-0.50');
  const [rightAxis, setRightAxis] = useState('90');
  const [rightAdd, setRightAdd] = useState('+1.50');

  const [leftSph, setLeftSph] = useState('-1.50');
  const [leftCyl, setLeftCyl] = useState('-0.25');
  const [leftAxis, setLeftAxis] = useState('85');
  const [leftAdd, setLeftAdd] = useState('+1.50');

  const [pdValue, setPdValue] = useState<number>(63);
  const [uploadedPrescFile, setUploadedPrescFile] = useState<string | null>(null);

  if (!product) return null;

  const totalPrice = product.price + selectedLens.price;

  const handleAddToCart = () => {
    const customPrescription: Prescription = {
      type: selectedLens.category as any,
      rightEye: { sph: rightSph, cyl: rightCyl, axis: rightAxis, add: rightAdd },
      leftEye: { sph: leftSph, cyl: leftCyl, axis: leftAxis, add: leftAdd },
      pd: pdValue,
      prescriptionFileUrl: uploadedPrescFile || undefined,
      date: new Date().toLocaleDateString()
    };

    addToCart(product, selectedColor, selectedLens, customPrescription, 1);
    setSelectedProductForLensConfig(null);
    setActiveTab('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in select-none">
      <div className="bg-white border border-stone-300 max-w-2xl w-full my-auto shadow-2xl text-stone-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-12 h-12 object-cover border border-stone-200"
            />
            <div>
              <div className="text-[10px] text-stone-500 font-mono font-bold uppercase tracking-widest">
                Precision Lens Configurator
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-950 leading-tight">
                {product.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setSelectedProductForLensConfig(null)}
            className="p-2 bg-white border border-stone-300 text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* STEP 1: CHOOSE FRAME COLOR */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
              1. Select Frame Finish:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`flex items-center gap-2 px-3 py-2 border text-xs font-mono uppercase transition-all cursor-pointer ${
                    selectedColor.name === c.name
                      ? 'bg-stone-950 text-white border-stone-950'
                      : 'bg-[#FAF8F5] border-stone-300 text-stone-700 hover:text-stone-950'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 border border-stone-400"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: CHOOSE OPTICAL LENS PACKAGE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                2. Select Optical Lenses & Coatings:
              </label>
              <span className="text-[10px] font-mono text-stone-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                1-Yr Warranty Included
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LENS_OPTIONS.map((lens) => {
                const isSelected = selectedLens.id === lens.id;
                return (
                  <div
                    key={lens.id}
                    onClick={() => setSelectedLens(lens)}
                    className={`p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-stone-950 ring-2 ring-stone-950/20 shadow-sm'
                        : 'bg-[#FAF8F5] border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-serif font-bold text-xs text-stone-950 leading-tight">
                          {lens.name}
                        </div>
                        <div className="text-xs font-mono font-bold text-stone-950 shrink-0">
                          +{formatPrice(lens.price, currency)}
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-stone-500 mt-0.5">
                        Index: {lens.index}
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1.5 leading-relaxed font-sans">
                        {lens.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200 flex flex-wrap gap-1">
                      {lens.coatings.slice(0, 3).map((coat) => (
                        <span key={coat} className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-white text-stone-600 border border-stone-300">
                          {coat}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: PRESCRIPTION POWER DETAILS (IF NOT ZERO POWER) */}
          {selectedLens.category !== 'zero_power' && (
            <div className="p-5 bg-[#FAF8F5] border border-stone-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono font-bold text-stone-900 uppercase tracking-widest">
                    3. Enter Optical Prescription (Power)
                  </span>
                </div>

                {/* Mode tabs */}
                <div className="flex gap-1 bg-white p-0.5 border border-stone-300">
                  <button
                    onClick={() => setPrescriptionMode('manual')}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase cursor-pointer ${
                      prescriptionMode === 'manual' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    onClick={() => setPrescriptionMode('upload')}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase cursor-pointer ${
                      prescriptionMode === 'upload' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Upload Slip
                  </button>
                  {prescriptions.length > 0 && (
                    <button
                      onClick={() => setPrescriptionMode('saved')}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase cursor-pointer ${
                        prescriptionMode === 'saved' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:text-stone-950'
                      }`}
                    >
                      Saved ({prescriptions.length})
                    </button>
                  )}
                </div>
              </div>

              {/* MANUAL PRESCRIPTION GRID */}
              {prescriptionMode === 'manual' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono font-bold text-stone-500 uppercase">
                    <div>Eye</div>
                    <div>SPH</div>
                    <div>CYL</div>
                    <div>AXIS</div>
                    {selectedLens.category === 'progressive_bifocal' && <div>ADD</div>}
                  </div>

                  {/* Right Eye OD */}
                  <div className="grid grid-cols-5 gap-2 items-center text-xs">
                    <div className="font-mono font-bold text-stone-950 text-center uppercase text-[11px]">OD (R)</div>
                    <input
                      type="text"
                      value={rightSph}
                      onChange={(e) => setRightSph(e.target.value)}
                      placeholder="-1.25"
                      className="bg-white border border-stone-300 p-2 text-center text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={rightCyl}
                      onChange={(e) => setRightCyl(e.target.value)}
                      placeholder="-0.50"
                      className="bg-white border border-stone-300 p-2 text-center text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={rightAxis}
                      onChange={(e) => setRightAxis(e.target.value)}
                      placeholder="90"
                      className="bg-white border border-stone-300 p-2 text-center text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-xs"
                    />
                    {selectedLens.category === 'progressive_bifocal' && (
                      <input
                        type="text"
                        value={rightAdd}
                        onChange={(e) => setRightAdd(e.target.value)}
                        placeholder="+1.50"
                        className="bg-white border border-stone-300 p-2 text-center text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-xs"
                      />
                    )}
                  </div>

                  {/* Left Eye OS */}
                  <div className="grid grid-cols-5 gap-2 items-center text-xs">
                    <div className="font-mono font-bold text-stone-950 text-center uppercase text-[11px]">OS (L)</div>
                    <input
                      type="text"
                      value={leftSph}
                      onChange={(e) => setLeftSph(e.target.value)}
                      placeholder="-1.50"
                      className="bg-white border border-stone-300 p-2 text-center text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={leftCyl}
                      onChange={(e) => setLeftCyl(e.target.value)}
                      placeholder="-0.25"
                      className="bg-white border border-stone-300 p-2 text-center text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={leftAxis}
                      onChange={(e) => setLeftAxis(e.target.value)}
                      placeholder="85"
                      className="bg-white border border-stone-300 p-2 text-center text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-xs"
                    />
                    {selectedLens.category === 'progressive_bifocal' && (
                      <input
                        type="text"
                        value={leftAdd}
                        onChange={(e) => setLeftAdd(e.target.value)}
                        placeholder="+1.50"
                        className="bg-white border border-stone-300 p-2 text-center text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-xs"
                      />
                    )}
                  </div>

                  {/* PD Quick Setting */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs font-mono">
                    <span className="text-stone-600">Pupillary Distance: <strong className="text-stone-950 font-bold">{pdValue} mm</strong></span>
                    <button
                      type="button"
                      onClick={() => setPdToolModalOpen(true)}
                      className="text-stone-950 hover:text-stone-700 font-bold uppercase text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Calibrate with PD Meter</span>
                    </button>
                  </div>
                </div>
              )}

              {/* UPLOAD SLIP MODE */}
              {prescriptionMode === 'upload' && (
                <div className="p-6 border-2 border-dashed border-stone-300 hover:border-stone-950 text-center space-y-2 bg-white transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-[#D4AF37]" />
                  <div className="font-serif font-bold text-xs text-stone-950">Upload Optometrist Slip (Image or PDF)</div>
                  <p className="text-[11px] text-stone-500 font-mono">Our lab technicians will verify the exact power before precision edging.</p>
                  <label className="inline-block px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-mono uppercase font-bold cursor-pointer">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedPrescFile(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {uploadedPrescFile && (
                    <div className="text-xs text-stone-900 font-mono font-bold flex items-center justify-center gap-1 pt-1">
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>Doctor Slip Attached</span>
                    </div>
                  )}
                </div>
              )}

              {/* SAVED PRESCRIPTION VAULT */}
              {prescriptionMode === 'saved' && (
                <div className="space-y-2">
                  {prescriptions.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setRightSph(p.rightEye.sph);
                        setRightCyl(p.rightEye.cyl);
                        setRightAxis(p.rightEye.axis);
                        setLeftSph(p.leftEye.sph);
                        setLeftCyl(p.leftEye.cyl);
                        setLeftAxis(p.leftEye.axis);
                        setPdValue(p.pd);
                        setPrescriptionMode('manual');
                      }}
                      className="p-3 bg-white hover:bg-[#FAF8F5] border border-stone-200 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-serif font-bold text-xs text-stone-950">{p.savedName || `Prescription #${idx + 1}`}</div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          OD: {p.rightEye.sph}/{p.rightEye.cyl} • OS: {p.leftEye.sph}/{p.leftEye.cyl} • PD: {p.pd}mm
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-950 uppercase">Use This</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Checkout Bar */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-stone-200 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">Total Atelier Package:</div>
            <div className="text-xl font-mono font-bold text-stone-950">
              {formatPrice(totalPrice, currency)}
            </div>
            <div className="text-[10px] font-mono text-stone-500">
              Frame ({formatPrice(product.price, currency)}) + Lenses ({formatPrice(selectedLens.price, currency)})
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-stone-950 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-stone-800 transition-all cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>Add Eyewear to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
