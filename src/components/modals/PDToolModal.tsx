import React, { useState } from 'react';
import { X, Sliders, Check, Sparkles, HelpCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PDToolModal: React.FC = () => {
  const { pdToolModalOpen, setPdToolModalOpen, t, savePrescription, prescriptions } = useApp();
  const [pdValue, setPdValue] = useState<number>(63);
  const [measurementMethod, setMeasurementMethod] = useState<'slider' | 'card_guide'>('slider');

  if (!pdToolModalOpen) return null;

  const handleSavePD = () => {
    const existing = prescriptions[0] || {
      savedName: 'My Optical Prescription',
      type: 'single_vision',
      rightEye: { sph: '0.00', cyl: '0.00', axis: '0' },
      leftEye: { sph: '0.00', cyl: '0.00', axis: '0' },
      pd: pdValue
    };

    savePrescription({
      ...existing,
      pd: pdValue
    });
    setPdToolModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="bg-white border border-stone-300 p-6 max-w-md w-full shadow-2xl text-stone-900 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FAF8F5] text-stone-950 border border-stone-300">
              <Sliders className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-950">{t.pupillaryDistance} Calibration</h3>
              <p className="text-xs text-stone-500 font-mono">Custom optical center focal alignment</p>
            </div>
          </div>
          <button
            onClick={() => setPdToolModalOpen(false)}
            className="p-2 bg-white border border-stone-300 text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PD Explanation */}
        <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 flex items-start gap-2.5 text-xs text-stone-600 font-sans">
          <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <p>
            <strong className="text-stone-950 font-serif">What is PD?</strong> Pupillary Distance is the distance (in mm) between the centers of your pupils. The adult average is <strong className="text-stone-950 font-mono">62–64 mm</strong>.
          </p>
        </div>

        {/* Visual Calibration Display */}
        <div className="bg-[#FAF8F5] p-6 border border-stone-200 text-center relative overflow-hidden">
          <div className="text-4xl font-bold text-stone-950 font-mono tracking-tight">
            {pdValue} <span className="text-sm text-stone-500 font-sans font-normal">mm</span>
          </div>
          <div className="text-xs text-stone-500 mt-1 font-mono uppercase font-bold">
            {pdValue < 60 ? 'Narrow Atelier Fit' : pdValue > 66 ? 'Wide Atelier Fit' : 'Standard Fit (Universal)'}
          </div>

          {/* Interactive Graphic Ruler */}
          <div className="mt-5 pt-4 border-t border-stone-200 relative">
            <div className="flex justify-between items-center px-4 relative">
              {/* Left Eye Dot */}
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 bg-stone-950 border border-stone-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37]" />
                </div>
                <span className="text-[10px] text-stone-500 mt-1 font-mono font-bold uppercase">Right Eye (OD)</span>
              </div>

              {/* Connecting line with mm badge */}
              <div className="flex-1 mx-3 h-0.5 bg-stone-300 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-950 text-white px-2 py-0.5 text-[10px] font-bold font-mono">
                  {pdValue} mm
                </span>
              </div>

              {/* Right Eye Dot */}
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 bg-stone-950 border border-stone-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37]" />
                </div>
                <span className="text-[10px] text-stone-500 mt-1 font-mono font-bold uppercase">Left Eye (OS)</span>
              </div>
            </div>
          </div>
        </div>

        {/* PD Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-stone-600 font-mono">
            <span>Range Calibration (54mm – 74mm):</span>
            <span className="text-stone-950 font-bold">{pdValue} mm</span>
          </div>
          <input
            type="range"
            min="54"
            max="74"
            step="1"
            value={pdValue}
            onChange={(e) => setPdValue(parseInt(e.target.value))}
            className="w-full accent-stone-950 bg-stone-200 h-2 cursor-pointer"
          />
        </div>

        {/* Standard Preset Buttons */}
        <div className="flex gap-2">
          {[
            { label: '61mm (Narrow)', val: 61 },
            { label: '63mm (Standard)', val: 63 },
            { label: '65mm (Wide)', val: 65 }
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => setPdValue(preset.val)}
              className={`flex-1 py-2 border text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                pdValue === preset.val 
                  ? 'bg-stone-950 border-stone-950 text-white' 
                  : 'bg-[#FAF8F5] border-stone-300 text-stone-700 hover:text-stone-950'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Save & Apply Action */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setPdToolModalOpen(false)}
            className="flex-1 py-3 bg-[#FAF8F5] hover:bg-stone-200 text-stone-800 border border-stone-300 font-mono uppercase font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePD}
            className="flex-1 py-3 bg-stone-950 hover:bg-stone-800 text-white font-mono uppercase font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4 text-[#D4AF37]" />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
