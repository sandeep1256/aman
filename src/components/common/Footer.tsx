import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle, 
  Navigation, 
  Glasses, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ExternalLink,
  Mail,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory } = useApp();

  const handleOpenDirections = () => {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=Aman+Opticals+Khandar+bus+stand+tiraha+Tel+meel+ke+pass+Sawai+Madhopur+Rajasthan+322201',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleWhatsApp = () => {
    window.open(
      'https://wa.me/919785609194?text=Hello%20Aman%20Opticals,%20I%20would%20like%20to%20inquire%20about%20optical%20frames%20and%20lenses.',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-14 pb-24 md:pb-12 border-t border-stone-800 selection:bg-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Highlight: Verified Google Business Profile & Quick Actions */}
        <div className="bg-[#292524] border border-stone-700/80 p-6 sm:p-8 mb-12 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest font-bold">
                  Verified Atelier
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Optical Products Manufacturer
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-wide">
                  Aman Opticals - Aman
                </h3>
                <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-amber-400 text-xs font-mono font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>5.0</span>
                  <span className="text-stone-400 font-normal">(4 Reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-mono text-stone-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Closed • Opens 10:30 am Sun</span>
                </span>
                <span className="text-stone-600 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Khandar bus stand tiraha Tel meel ke pass, Sawai Madhopur, RJ 322201</span>
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:09785609194"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c59e2b] text-stone-950 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Call 097856 09194</span>
              </a>

              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleOpenDirections}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Directions</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-transparent hover:bg-stone-800 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
              >
                <span>Contact Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column Navigation & Atelier Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Column 1: Brand & Optical Manufacturer Credo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#D4AF37] text-stone-950 flex items-center justify-center font-bold font-serif text-sm">
                AO
              </div>
              <span className="font-serif text-lg tracking-wider text-white">
                AMAN OPTICALS
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Precision Optical Products Manufacturer based in Sawai Madhopur, Rajasthan. Specializing in high-tolerance ophthalmic surfacing, designer acetate and titanium frames, and anti-reflective blue-cut lenses.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-stone-400">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>100% Certified Optical Surfacing</span>
            </div>
          </div>

          {/* Column 2: Optical Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Optical Collections
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Spectacle Frames & Rimless
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('sunglasses');
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Polarized & UV400 Sunglasses
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('computer_bluecut');
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Digital Blue-Cut Screen Glasses
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('reading');
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Reading & Progressive Lenses
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('kids');
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  TR-90 Flexible Kids Eyewear
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Virtual Atelier Studios */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Digital Atelier Studios
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('tryon');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>3D Virtual Try-On Live Lab</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('stylist');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  AI Facial Morphology Stylist
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Book Free Eye Exam at Store
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Prescription Records Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Wholesale & Bulk Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Location & Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Atelier Location & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400 font-mono">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Khandar bus stand tiraha Tel meel ke pass, Sawai Madhopur, Rajasthan 322201
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-white font-bold">Daily: 10:30 AM – 8:30 PM</div>
                  <div className="text-[11px] text-stone-400">Open Sundays from 10:30 AM</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="tel:09785609194" className="text-stone-200 hover:text-white underline">
                  097856 09194
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal & Owner Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} Aman Opticals - Aman. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Optical Products Manufacturer, Sawai Madhopur</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-stone-400 hover:text-stone-200 transition-colors"
            >
              Contact Atelier
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors"
            >
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
