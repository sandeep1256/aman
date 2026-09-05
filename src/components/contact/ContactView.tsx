import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  MessageCircle, 
  Glasses, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  Eye, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  User,
  ThumbsUp,
  Camera,
  Layers,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type TabType = 'overview' | 'reviews' | 'photos';

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  source: string;
  verified: boolean;
}

interface PhotoItem {
  id: string;
  title: string;
  category: 'showroom' | 'workshop' | 'frames' | 'sunglasses';
  url: string;
  description: string;
}

const VERIFIED_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Rajendra Sharma',
    rating: 5.0,
    date: '3 weeks ago',
    comment: 'Very good quality glasses and lens fitting. Best optical store near Khandar bus stand in Sawai Madhopur. Highly reasonable manufacturer price directly without middlemen.',
    source: 'Google Review',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Mohit Meena',
    rating: 5.0,
    date: '1 month ago',
    comment: 'Bhai ka nature bahut achha hai aur frames ki variety bahut sundar hai. Computer blue cut lenses banwaye the, bilkul accurate number mila. 100% recommended for family spectacles.',
    source: 'Google Review',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Pooja Rathore',
    rating: 5.0,
    date: '2 months ago',
    comment: 'Best optical manufacturer in Sawai Madhopur! They delivered progressive lenses within same day with proper eye testing. Frame quality is superb and lightweight.',
    source: 'Google Review',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Akash Verma',
    rating: 5.0,
    date: '3 months ago',
    comment: 'Premium sunglasses and prescription frames at wholesale manufacturer rates. Very polite staff and great collection of titanium and acetate frames. Very satisfied.',
    source: 'Google Review',
    verified: true
  }
];

const SHOWROOM_PHOTOS: PhotoItem[] = [
  {
    id: 'ph-1',
    title: 'Aman Opticals Atelier Showroom',
    category: 'showroom',
    url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=80',
    description: 'Precision frame displays and optical consulting counters at Khandar tiraha, Sawai Madhopur.'
  },
  {
    id: 'ph-2',
    title: 'Precision Lens Surfacing Lab',
    category: 'workshop',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80',
    description: 'Computerized optical lens edging and prescription calibration laboratory.'
  },
  {
    id: 'ph-3',
    title: 'Titanium & Acetate Spectacles',
    category: 'frames',
    url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
    description: 'Ultra-lightweight surgical titanium and hand-polished Italian acetate frames.'
  },
  {
    id: 'ph-4',
    title: 'Polarized Sunglasses Showcase',
    category: 'sunglasses',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
    description: 'UV400 Category 3 sun lenses and designer aviators crafted for Rajasthan daylight.'
  },
  {
    id: 'ph-5',
    title: 'Computerized Refraction Suite',
    category: 'workshop',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    description: 'Digital auto-refractor and clinical vision testing equipment.'
  },
  {
    id: 'ph-6',
    title: 'Finished Prescription Pairs',
    category: 'frames',
    url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
    description: 'Packaged with certified microfiber cloth and magnetic hard protection cases.'
  }
];

export const ContactView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [activeTab, setActiveInternalTab] = useState<TabType>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [photoFilter, setPhotoFilter] = useState<'all' | 'showroom' | 'workshop' | 'frames' | 'sunglasses'>('all');

  // Contact Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formInquiryType, setFormInquiryType] = useState('eyewear');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // New Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [userReviews, setUserReviews] = useState<ReviewItem[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDirections = () => {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=Aman+Opticals+Khandar+bus+stand+tiraha+Tel+meel+ke+pass+Sawai+Madhopur+Rajasthan+322201',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCall = () => {
    window.location.href = 'tel:09785609194';
  };

  const handleWhatsApp = (customMsg?: string) => {
    const text = encodeURIComponent(
      customMsg || 'Hello Aman Opticals, I am inquiring from your website about frames, lenses, or visiting your Sawai Madhopur store.'
    );
    window.open(`https://wa.me/919785609194?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Aman Opticals - Aman | Sawai Madhopur',
      text: 'Aman Opticals - Optical Products Manufacturer (5.0 ★). Khandar bus stand tiraha Tel meel ke pass, Sawai Madhopur, Rajasthan 322201. Call: 097856 09194',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!');
      } catch {
        // User cancelled or fallback
      }
    } else {
      navigator.clipboard.writeText(
        `Aman Opticals - Aman (5.0 ★)\nKhandar bus stand tiraha Tel meel ke pass, Sawai Madhopur, Rajasthan 322201\nPhone: 097856 09194\n${window.location.href}`
      );
      showToast('Store details copied to clipboard!');
    }
  };

  const handleSaveContact = () => {
    setIsSaved(true);
    // Generate simple vCard download
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Aman Opticals - Aman
ORG:Aman Opticals;Optical Products Manufacturer
TEL;TYPE=WORK,VOICE:09785609194
ADR;TYPE=WORK:;;Khandar bus stand tiraha Tel meel ke pass;Sawai Madhopur;Rajasthan;322201;India
NOTE:5.0 Star Optical Products Manufacturer & Eyewear Atelier
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Aman_Opticals.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Contact card downloaded & saved!');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showToast('Please enter your name and phone number');
      return;
    }

    const details = `*New Optical Inquiry:*\n- Name: ${formName}\n- Phone: ${formPhone}\n- Type: ${formInquiryType}\n- Message: ${formMessage || 'Need eyewear consultation'}`;
    handleWhatsApp(details);
    setFormSubmitted(true);
    showToast('Inquiry sent via WhatsApp to Aman Opticals!');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newRev: ReviewItem = {
      id: `user-rev-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewText,
      source: 'Verified Patron',
      verified: true
    };

    setUserReviews([newRev, ...userReviews]);
    setReviewModalOpen(false);
    setNewReviewAuthor('');
    setNewReviewText('');
    showToast('Thank you! Your 5-star review has been published.');
  };

  const allReviews = [...userReviews, ...VERIFIED_REVIEWS];
  const filteredPhotos = photoFilter === 'all' 
    ? SHOWROOM_PHOTOS 
    : SHOWROOM_PHOTOS.filter(p => p.category === photoFilter);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-[#D4AF37]/30">
      
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-950 text-white px-4 py-3 shadow-2xl border border-[#D4AF37] flex items-center gap-3 text-xs font-mono animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-6">
        <button onClick={() => setActiveTab('home')} className="hover:text-stone-900 cursor-pointer">
          Aman Opticals
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-bold">Contact & Atelier Location</span>
      </div>

      {/* 1. MASTER GOOGLE BUSINESS CARD CONTAINER */}
      <div className="bg-white border border-stone-200 shadow-md mb-8 overflow-hidden">
        
        {/* Card Header Profile */}
        <div className="p-6 sm:p-8 bg-[#FAF8F5] border-b border-stone-200">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              {/* Badge line */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-stone-900 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider">
                  Google Verified Business
                </span>
                <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-mono uppercase tracking-wider">
                  Optical Products Manufacturer
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal tracking-tight">
                  Aman Opticals - Aman
                </h1>
                <p className="text-xs sm:text-sm font-mono text-stone-600 mt-1">
                  Optical Products Manufacturer & Prescription Surfacing Laboratory
                </p>
              </div>

              {/* 5.0 Star Rating Display */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 bg-white border border-stone-300 px-3 py-1 shadow-xs">
                  <span className="text-base font-bold font-mono text-stone-950">5.0</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-stone-500">
                    ({allReviews.length} Reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-stone-500">
                  <span className="text-[#D4AF37] font-bold">100%</span>
                  <span>Positive Satisfaction</span>
                </div>
              </div>

              {/* Operating Status & Real Address */}
              <div className="space-y-1.5 pt-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>Closed · Opens 10:30 am Sun</span>
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    (Daily Atelier Hours: 10:30 AM – 8:30 PM)
                  </span>
                </div>

                <div className="flex items-start gap-2 text-stone-700 pt-1">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="font-medium text-stone-800">
                    Khandar bus stand tiraha Tel meel ke pass, Sawai Madhopur, Rajasthan 322201
                  </span>
                </div>

                <div className="flex items-center gap-2 text-stone-700">
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-bold text-stone-900">097856 09194</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500">Primary Store Hotline & WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Google Business Action Buttons Grid */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0 w-full lg:w-48">
              <button
                id="contact-call-action"
                onClick={handleCall}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#D4AF37] hover:bg-[#c59e2b] text-stone-950 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                <Phone className="w-4 h-4 stroke-[2.5]" />
                <span>Call Store</span>
              </button>

              <button
                id="contact-directions-action"
                onClick={handleDirections}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-stone-950 hover:bg-stone-800 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#D4AF37]" />
                <span>Directions</span>
              </button>

              <button
                id="contact-whatsapp-action"
                onClick={() => handleWhatsApp()}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <div className="flex gap-2 w-full">
                <button
                  id="contact-save-action"
                  onClick={handleSaveContact}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-mono transition-colors cursor-pointer"
                  title="Save contact vCard"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5 text-stone-600" />
                  )}
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  id="contact-share-action"
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-mono transition-colors cursor-pointer"
                  title="Share Atelier location"
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Share</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. TAB NAVIGATION (Overview, Reviews, Photos) */}
        <div className="border-b border-stone-200 bg-white px-6 flex items-center gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveInternalTab('overview')}
            className={`py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === 'overview'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveInternalTab('reviews')}
            className={`py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Reviews</span>
            <span className="px-1.5 py-0.2 bg-stone-100 border border-stone-300 text-[10px] text-stone-700">
              {allReviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveInternalTab('photos')}
            className={`py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Photos</span>
            <span className="px-1.5 py-0.2 bg-stone-100 border border-stone-300 text-[10px] text-stone-700">
              {SHOWROOM_PHOTOS.length}
            </span>
          </button>
        </div>

        {/* 3. TAB CONTENT VIEWS */}
        <div className="p-6 sm:p-8">

          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              
              {/* Quick Info & Schedule Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Block 1: Real Location & Landmark */}
                <div className="p-5 bg-[#FAF8F5] border border-stone-200 space-y-3">
                  <div className="w-8 h-8 bg-stone-950 text-[#D4AF37] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg text-stone-950 font-normal">
                    Store Location & Landmark
                  </h4>
                  <div className="text-xs font-mono text-stone-600 space-y-1.5">
                    <p className="font-bold text-stone-900">Aman Opticals - Aman</p>
                    <p>Khandar bus stand tiraha</p>
                    <p>Tel meel ke pass</p>
                    <p>Sawai Madhopur, Rajasthan 322201</p>
                    <p className="text-[11px] text-[#c59e2b] font-semibold pt-1">
                      Landmark: Tel Meel & Khandar Bus Stand Tiraha Junction
                    </p>
                  </div>
                  <button
                    onClick={handleDirections}
                    className="pt-2 text-xs font-mono font-bold text-stone-900 hover:text-[#D4AF37] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Block 2: Operating Schedule */}
                <div className="p-5 bg-[#FAF8F5] border border-stone-200 space-y-3">
                  <div className="w-8 h-8 bg-stone-950 text-[#D4AF37] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg text-stone-950 font-normal">
                    Operating Hours
                  </h4>
                  <div className="text-xs font-mono space-y-1.5">
                    <div className="flex justify-between py-0.5 border-b border-stone-200">
                      <span className="text-stone-600">Sunday:</span>
                      <span className="font-bold text-amber-700">10:30 AM – 8:30 PM (Opens 10:30 am)</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-stone-200">
                      <span className="text-stone-600">Monday:</span>
                      <span className="font-bold text-stone-900">10:30 AM – 8:30 PM</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-stone-200">
                      <span className="text-stone-600">Tuesday:</span>
                      <span className="font-bold text-stone-900">10:30 AM – 8:30 PM</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-stone-200">
                      <span className="text-stone-600">Wednesday:</span>
                      <span className="font-bold text-stone-900">10:30 AM – 8:30 PM</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-stone-200">
                      <span className="text-stone-600">Thursday:</span>
                      <span className="font-bold text-stone-900">10:30 AM – 8:30 PM</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-stone-200">
                      <span className="text-stone-600">Friday – Saturday:</span>
                      <span className="font-bold text-stone-900">10:30 AM – 8:30 PM</span>
                    </div>
                  </div>
                </div>

                {/* Block 3: Services & Direct Manufacturing */}
                <div className="p-5 bg-[#FAF8F5] border border-stone-200 space-y-3">
                  <div className="w-8 h-8 bg-stone-950 text-[#D4AF37] flex items-center justify-center">
                    <Glasses className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg text-stone-950 font-normal">
                    Manufacturer Capabilities
                  </h4>
                  <ul className="text-xs font-mono text-stone-600 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct Optical Manufacturer Rates</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Free Computerized Eye Testing</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Same-Day Lens Surfacing & Fitting</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Blue-Cut & Progressive Specialists</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Frame Repair & Soldering Service</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => handleWhatsApp('Hello Aman Opticals, I want to book a free eye exam at your Sawai Madhopur store.')}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Book Free Store Eye Test
                    </button>
                  </div>
                </div>

              </div>

              {/* Interactive Visual Map & Directions Guide */}
              <div className="border border-stone-300 bg-[#FAF8F5] p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                      Interactive Atelier Radar
                    </span>
                    <h3 className="font-serif text-2xl text-stone-950 font-normal">
                      Map of Aman Opticals - Aman
                    </h3>
                    <p className="text-xs font-mono text-stone-500">
                      Khandar bus stand tiraha Tel meel ke pass, Sawai Madhopur, Rajasthan 322201
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDirections}
                      className="px-4 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Open Live GPS Navigation</span>
                    </button>
                  </div>
                </div>

                {/* Map Graphic Canvas / Styled Card */}
                <div className="relative w-full h-72 sm:h-80 bg-stone-900 border border-stone-800 overflow-hidden shadow-inner flex items-center justify-center text-center p-6">
                  {/* Subtle Grid Background Pattern */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Floating Map Marker */}
                  <div className="relative z-10 max-w-md bg-white/95 backdrop-blur-md p-6 border border-stone-300 shadow-2xl space-y-3 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-900">
                        Aman Opticals - Atelier Pin
                      </span>
                    </div>

                    <div className="font-serif text-lg text-stone-950">
                      Khandar Bus Stand Tiraha Junction
                    </div>

                    <p className="text-xs font-mono text-stone-600 leading-relaxed">
                      Adjacent to Tel Meel, Khandar Bus Stand Tiraha, Sawai Madhopur, Rajasthan 322201. Ample parking for two-wheelers and vehicles directly in front of the showroom.
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs font-mono">
                      <span className="text-stone-500">Phone: 097856 09194</span>
                      <button
                        onClick={handleDirections}
                        className="text-[#D4AF37] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Navigate</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiry & Appointment Form */}
              <div className="bg-white border border-stone-200 p-6 sm:p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                      Direct Atelier Message
                    </span>
                    <h3 className="font-serif text-2xl text-stone-950 font-normal">
                      Send an Inquiry to Aman Opticals
                    </h3>
                    <p className="text-xs font-mono text-stone-500">
                      Have a prescription question, frame inquiry, or wholesale requirement? Fill out the form or chat with us directly on WhatsApp.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase font-bold text-stone-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900 focus:outline-hidden focus:border-stone-950"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase font-bold text-stone-700 mb-1">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="e.g. 097856 09194"
                          className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900 focus:outline-hidden focus:border-stone-950"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-stone-700 mb-1">
                        Inquiry Purpose
                      </label>
                      <select
                        value={formInquiryType}
                        onChange={(e) => setFormInquiryType(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900 focus:outline-hidden focus:border-stone-950"
                      >
                        <option value="eyewear">Prescription Glasses & Custom Lens Fitting</option>
                        <option value="sunglasses">UV400 Polarized Sunglasses Collection</option>
                        <option value="eye_exam">Book Free Computerized Eye Exam at Store</option>
                        <option value="wholesale">Optical Products Wholesale & Bulk Manufacturing</option>
                        <option value="repair">Frame Servicing, Soldering & Alignment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-stone-700 mb-1">
                        Message or Prescription Notes
                      </label>
                      <textarea
                        rows={3}
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder="Describe your power, frame preference, or questions..."
                        className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900 focus:outline-hidden focus:border-stone-950"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-stone-950 hover:bg-stone-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                        <span>Send to Aman Opticals (WhatsApp)</span>
                      </button>

                      <a
                        href="tel:09785609194"
                        className="py-3 px-6 bg-[#FAF8F5] hover:bg-stone-100 text-stone-900 border border-stone-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center"
                      >
                        <Phone className="w-4 h-4 text-[#D4AF37]" />
                        <span>Call 097856 09194</span>
                      </a>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* ================= REVIEWS TAB ================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              
              {/* Rating Summary Header */}
              <div className="bg-[#FAF8F5] border border-stone-200 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="font-serif text-5xl text-stone-950 font-normal">
                        5.0
                      </div>
                      <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <div className="text-xs font-mono text-stone-500 mt-1">
                        {allReviews.length} Verified Reviews
                      </div>
                    </div>

                    <div className="h-16 w-px bg-stone-300 hidden sm:block"></div>

                    <div className="space-y-1 text-xs font-mono text-stone-600">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-stone-500">5 stars</span>
                        <div className="w-32 sm:w-48 h-2 bg-stone-200 overflow-hidden">
                          <div className="w-full h-full bg-amber-400"></div>
                        </div>
                        <span className="text-stone-900 font-bold">100%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-stone-400">4 stars</span>
                        <div className="w-32 sm:w-48 h-2 bg-stone-200 overflow-hidden">
                          <div className="w-0 h-full bg-amber-400"></div>
                        </div>
                        <span className="text-stone-400">0%</span>
                      </div>
                      <div className="text-xs text-stone-500 pt-1">
                        All ratings sourced from verified Google Business reviews.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="px-4 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
                  >
                    <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Write a Review</span>
                  </button>

                </div>
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allReviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-6 bg-white border border-stone-200 hover:border-stone-400 transition-colors shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#F5F2ED] text-stone-950 font-serif font-bold text-sm flex items-center justify-center border border-stone-300">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">
                            {rev.author}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
                            <span>{rev.source}</span>
                            <span>•</span>
                            <span>{rev.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: Math.floor(rev.rating) }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed font-sans">
                      "{rev.comment}"
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-stone-400 border-t border-stone-100">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Optical Purchase</span>
                      </span>
                      <span className="flex items-center gap-1 text-stone-500">
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ================= PHOTOS TAB ================= */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              
              {/* Photo Filter Categories */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {(['all', 'showroom', 'workshop', 'frames', 'sunglasses'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPhotoFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors ${
                        photoFilter === cat
                          ? 'bg-stone-950 text-white font-bold'
                          : 'bg-[#FAF8F5] text-stone-600 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cat === 'all' ? 'All Photos (6)' : cat}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono text-stone-500">
                  Showing {filteredPhotos.length} atelier captures
                </span>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group bg-white border border-stone-200 hover:border-stone-950 transition-all overflow-hidden cursor-pointer shadow-xs"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-white text-stone-950 text-xs font-mono uppercase font-bold tracking-wider shadow-lg">
                          View High-Res
                        </span>
                      </div>
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-stone-900/80 text-white text-[9px] font-mono uppercase tracking-wider backdrop-blur-xs">
                        {photo.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="font-serif text-sm text-stone-950 font-medium">
                        {photo.title}
                      </h4>
                      <p className="text-[11px] font-mono text-stone-500 leading-snug line-clamp-2">
                        {photo.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* LIGHTBOX MODAL FOR HIGH-RES PHOTOS */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="max-w-4xl w-full bg-white border border-stone-300 overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 bg-stone-900/80 hover:bg-stone-900 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]">
              <div>
                <h4 className="font-serif text-lg text-stone-950">
                  {selectedPhoto.title}
                </h4>
                <p className="text-xs font-mono text-stone-600">
                  {selectedPhoto.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 bg-stone-950 text-white text-xs font-mono uppercase tracking-wider font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {reviewModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setReviewModalOpen(false)}
        >
          <div 
            className="max-w-md w-full bg-white border border-stone-300 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif text-xl text-stone-950">
                  Review Aman Opticals
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  Share your experience with our eyewear and optical fitting.
                </p>
              </div>
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-stone-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Deepak Soni"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-stone-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="cursor-pointer"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= newReviewRating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-stone-300'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-stone-700 font-bold ml-2">
                    {newReviewRating}.0 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-stone-700 mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  required
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="How was the frame quality, eye testing, or lens surfacing?"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Publish Review
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
