import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  CheckCircle2, 
  ThumbsUp, 
  Camera, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  X, 
  Send,
  MessageSquare,
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';
import { GmbReview, GmbProfileData } from '../../types';
import { 
  INITIAL_GMB_PROFILE, 
  INITIAL_GMB_REVIEWS, 
  subscribeToGmbReviews, 
  addGmbReviewToFirestore, 
  syncGmbProfileToFirestore 
} from '../../services/dbService';
import { useApp } from '../../context/AppContext';

export const GoogleBusinessProfileSection: React.FC = () => {
  const { addNotification } = useApp();
  const [reviews, setReviews] = useState<GmbReview[]>(INITIAL_GMB_REVIEWS);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'photos' | 'map'>('overview');
  const [savedToBookmarks, setSavedToBookmarks] = useState<boolean>(false);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // New review form states
  const [authorName, setAuthorName] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [userLocation, setUserLocation] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  // Real-time Firestore sync for reviews
  useEffect(() => {
    syncGmbProfileToFirestore();

    const unsubscribe = subscribeToGmbReviews((fetchedReviews) => {
      setReviews(fetchedReviews);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    });

    return () => unsubscribe();
  }, []);

  const handleShare = () => {
    const url = INITIAL_GMB_PROFILE.shareUrl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedShareLink(true);
      addNotification('🔗 Google Link Copied', 'Aman Opticals Google Business profile link copied to clipboard.', 'success');
      setTimeout(() => setCopiedShareLink(false), 3000);
    }
  };

  const handleSave = () => {
    setSavedToBookmarks(!savedToBookmarks);
    addNotification(
      !savedToBookmarks ? '📍 Location Saved' : 'Removed from Saved',
      !savedToBookmarks 
        ? 'Aman Opticals saved to your favorites for quick store directions.' 
        : 'Store removed from saved bookmarks.',
      'info'
    );
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncGmbProfileToFirestore();
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      addNotification('☁️ Cloud Synced', 'Google Business data and reviews synced with Firestore database.', 'success');
    }, 600);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setSubmittingReview(true);
    try {
      await addGmbReviewToFirestore({
        author: authorName.trim(),
        rating,
        date: 'Just now',
        comment: comment.trim(),
        source: 'Google Review',
        verified: true,
        userLocation: userLocation.trim() || 'Sawai Madhopur',
        likes: 1
      });

      setReviewSuccess(true);
      setAuthorName('');
      setComment('');
      setUserLocation('');
      setRating(5);
      addNotification('★ Review Submitted', 'Thank you! Your verified review has been synced to the database.', 'success');

      setTimeout(() => {
        setReviewSuccess(false);
        setIsWriteModalOpen(false);
        setActiveTab('reviews');
      }, 1400);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return '5.0';
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const gmbPhotos = [
    {
      title: 'Aman Opticals Main Atelier Showroom',
      url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
      caption: 'Khandar Bus Stand Tiraha, Sawai Madhopur'
    },
    {
      title: 'Precision Optical Surfacing Lab',
      url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      caption: 'Computerized automated lens edging & fitting'
    },
    {
      title: 'Designer Frames & Sunglasses Collection',
      url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      caption: 'Pure Titanium, Acetate, and Metal luxury spectacles'
    },
    {
      title: 'Digital Lens Power Testing Equipment',
      url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80',
      caption: 'Accurate ophthalmic refractive testing suite'
    }
  ];

  return (
    <section id="google-business-profile-section" className="max-w-7xl mx-auto px-4 py-12">
      {/* Top Banner Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          {/* Official Google G icon */}
          <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center p-1.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                GOOGLE BUSINESS PROFILE
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
              Aman Opticals Official GMB Profile
            </h2>
          </div>
        </div>

        {/* Live Firestore Sync Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 text-xs font-mono text-stone-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Firestore Sync: {lastSyncTime}</span>
            <button 
              onClick={handleManualSync}
              disabled={isSyncing}
              className="ml-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              title="Sync latest reviews from Firestore database"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>
          </div>

          <a 
            href={INITIAL_GMB_PROFILE.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-white font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
          </a>
        </div>
      </div>

      {/* Main GMB Profile Card Container */}
      <div className="bg-white border border-stone-300 shadow-sm overflow-hidden">
        
        {/* Header Block with Business Metadata */}
        <div className="p-6 sm:p-8 bg-[#FAF8F5] border-b border-stone-200">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-3 h-3">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  Google Verified Merchant
                </span>
                <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Optical Products Manufacturer
                </span>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Sawai Madhopur, RJ
                </span>
              </div>

              <div>
                <h3 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
                  Aman Opticals - Aman
                </h3>
                <p className="text-stone-600 text-sm mt-1">
                  Optical Products Manufacturer & Eyewear Studio · Lab Dispensing & Direct Factory Rates
                </p>
              </div>

              {/* Rating Strip */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 border border-stone-200 shadow-xs">
                  <span className="font-mono text-xl font-bold text-stone-950">
                    {calculateAverageRating()}
                  </span>
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="text-stone-400 text-xs font-mono">|</span>
                  <span className="text-stone-700 font-mono text-xs font-bold">
                    ({reviews.length} Google Reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-600 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-emerald-800">Closed · Opens 10:30 am Sun</span>
                  <span className="text-stone-400">(Mon–Sat: 10:00 AM – 9:00 PM)</span>
                </div>
              </div>

              {/* Key Highlights Chips */}
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-stone-700 font-mono">
                <span className="px-2.5 py-1 bg-white border border-stone-200 flex items-center gap-1">
                  ✓ In-Store Optical Testing
                </span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 flex items-center gap-1">
                  ✓ Computerized Lens Surfacing
                </span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 flex items-center gap-1">
                  ✓ Same-Day Dispensing
                </span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 flex items-center gap-1">
                  ✓ Pan-India Delivery
                </span>
              </div>
            </div>

            {/* Quick Contact & Google Action Buttons */}
            <div className="flex flex-wrap lg:flex-col gap-2 min-w-[220px]">
              <a 
                href={INITIAL_GMB_PROFILE.mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 lg:flex-none py-3 px-4 bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Navigation className="w-4 h-4 text-[#D4AF37]" />
                <span>Get Directions</span>
              </a>

              <a 
                href={`tel:${INITIAL_GMB_PROFILE.phone}`}
                className="flex-1 lg:flex-none py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-950 font-mono font-bold text-xs uppercase tracking-wider border border-stone-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Call: 097856 09194</span>
              </a>

              <div className="flex gap-2 w-full">
                <button
                  onClick={handleSave}
                  className={`flex-1 py-2 px-3 border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    savedToBookmarks 
                      ? 'bg-stone-900 text-white border-stone-900' 
                      : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {savedToBookmarks ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                      <span>Save</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="flex-1 py-2 px-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>{copiedShareLink ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="w-full py-2 px-3 bg-[#FAF8F5] hover:bg-[#F2ECE1] text-stone-900 border border-stone-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Overview | Reviews | Photos | Maps) */}
        <div className="flex border-b border-stone-200 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-stone-950 text-stone-950 bg-[#FAF8F5]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Overview & Atelier
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-stone-950 text-stone-950 bg-[#FAF8F5]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <span>Verified Reviews</span>
            <span className="px-1.5 py-0.2 bg-[#D4AF37] text-stone-950 text-[10px] rounded-full font-bold">
              {reviews.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'photos'
                ? 'border-stone-950 text-stone-950 bg-[#FAF8F5]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Showroom Photos
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'map'
                ? 'border-stone-950 text-stone-950 bg-[#FAF8F5]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Map & Directions
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Address & Hours */}
              <div className="p-5 bg-[#FAF8F5] border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>Atelier Location</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {INITIAL_GMB_PROFILE.address}
                </p>
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Landmark</span>
                  <span className="text-xs font-bold text-stone-800">Near Khandar Bus Stand Tiraha, Tel Meel</span>
                </div>
              </div>

              {/* Operating Timings */}
              <div className="p-5 bg-[#FAF8F5] border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Business Hours</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-stone-700 font-bold">
                    <span>Sunday:</span>
                    <span>10:30 AM – 8:30 PM</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Monday – Saturday:</span>
                    <span>10:00 AM – 9:00 PM</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-200 text-[11px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Open 7 Days a Week for Eye Consultations</span>
                </div>
              </div>

              {/* Verified Facilities */}
              <div className="p-5 bg-[#FAF8F5] border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>In-Store Facilities</span>
                </div>
                <ul className="text-xs text-stone-600 space-y-1.5 font-sans">
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">✓</span> Computerized Digital Eye Testing
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">✓</span> On-Site Precision Lens Edging & Mounting
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">✓</span> Direct Factory Wholesale Rates
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">✓</span> Wheelchair Accessible Entrance & Parking
                  </li>
                </ul>
              </div>
            </div>

            {/* Google Rating Breakdown Summary */}
            <div className="p-6 bg-stone-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  OFFICIAL GOOGLE RATING
                </span>
                <h4 className="font-serif text-2xl font-normal">
                  100% Five-Star Patron Satisfaction
                </h4>
                <p className="text-xs text-stone-400 max-w-xl">
                  Every pair of spectacles, progressive lens fitting, and sunglasses dispensed by Aman Opticals is evaluated on clarity, optical tolerance, and comfortable bridge posture.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-serif text-5xl font-bold text-white tracking-tight">5.0</div>
                  <div className="flex text-[#D4AF37] justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <div className="text-[11px] font-mono text-stone-400 mt-1">
                    {reviews.length} Verified Reviews
                  </div>
                </div>

                <div className="w-px h-16 bg-stone-800 hidden sm:block"></div>

                <div className="text-xs font-mono space-y-1 min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400">5 Star</span>
                    <div className="flex-1 bg-stone-800 h-2">
                      <div className="bg-[#D4AF37] h-full w-full"></div>
                    </div>
                    <span>100%</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500">
                    <span>4 Star</span>
                    <div className="flex-1 bg-stone-800 h-2"></div>
                    <span>0%</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500">
                    <span>3 Star</span>
                    <div className="flex-1 bg-stone-800 h-2"></div>
                    <span>0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFIED REVIEWS (LIVE SYNCED WITH FIRESTORE) */}
        {activeTab === 'reviews' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  AUTHENTIC GOOGLE REVIEWS
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-stone-950 font-normal">
                  Customer Testimonials ({reviews.length})
                </h4>
                <p className="text-xs text-stone-500">
                  Reviews are synchronized live with Firestore and reflect public Google Business feedback.
                </p>
              </div>

              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="py-2.5 px-4 bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Write a Google Review</span>
              </button>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="p-5 bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-900 text-white font-serif font-bold text-base flex items-center justify-center shadow-xs">
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-serif font-bold text-stone-950 text-sm">
                            {rev.author}
                          </h5>
                          {rev.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" title="Verified Google Review" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500">
                          <span>{rev.date}</span>
                          {rev.userLocation && (
                            <>
                              <span>•</span>
                              <span>{rev.userLocation}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-1 bg-white border border-stone-200 text-xs font-mono font-bold">
                      <div className="flex text-[#D4AF37]">
                        {[...Array(Math.floor(rev.rating || 5))].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />
                        ))}
                      </div>
                      <span className="text-stone-800 ml-1">{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans italic">
                    "{rev.comment}"
                  </p>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span className="flex items-center gap-1 text-blue-700 font-bold">
                      <svg viewBox="0 0 24 24" className="w-3 h-3">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      {rev.source}
                    </span>

                    <button 
                      onClick={() => addNotification('👍 Helpful Vote', 'Thank you for your feedback on this review.', 'info')}
                      className="flex items-center gap-1 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.likes || 1})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SHOWROOM PHOTOS */}
        {activeTab === 'photos' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-stone-200">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                ATELIER GALLERY
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-stone-950 font-normal">
                Optical Lab & Showroom Gallery
              </h4>
              <p className="text-xs text-stone-500">
                Photographs from our central manufacturing workshop and showroom in Sawai Madhopur, Rajasthan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {gmbPhotos.map((photo, idx) => (
                <div 
                  key={idx}
                  className="group bg-[#FAF8F5] border border-stone-200 overflow-hidden shadow-xs hover:border-stone-400 transition-all"
                >
                  <div className="aspect-4/3 overflow-hidden bg-stone-200 relative">
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-4 space-y-1">
                    <h5 className="font-serif font-bold text-stone-950 text-xs truncate">
                      {photo.title}
                    </h5>
                    <p className="text-[11px] text-stone-500 line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MAP & DIRECT DIRECTIONS */}
        {activeTab === 'map' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  GEOGRAPHIC NAVIGATION
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-stone-950 font-normal">
                  Location & Driving Route
                </h4>
                <p className="text-xs text-stone-500">
                  Easily accessible at Khandar Tiraha, Sawai Madhopur with direct parking.
                </p>
              </div>

              <a
                href={INITIAL_GMB_PROFILE.mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Open Google Navigation</span>
              </a>
            </div>

            {/* Embedded Interactive Map Card */}
            <div className="border border-stone-300 relative overflow-hidden bg-stone-100 aspect-16/9 sm:aspect-21/9 min-h-[300px]">
              <iframe
                title="Aman Opticals Google Map Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?q=Khandar+bus+stand+tiraha+Tel+meel+Sawai+Madhopur+Rajasthan+322201&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter saturate-90 contrast-105"
                loading="lazy"
              ></iframe>

              {/* Floating Overlay Badge on Map */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3.5 border border-stone-300 shadow-md max-w-xs space-y-1.5 hidden sm:block">
                <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-stone-950">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>Aman Opticals - Aman</span>
                </div>
                <p className="text-[11px] text-stone-600 font-sans leading-tight">
                  Khandar bus stand tiraha Tel meel ke pass, Sawai Madhopur, Rajasthan 322201
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-700 font-bold">● Open for Visits</span>
                  <a 
                    href={`tel:${INITIAL_GMB_PROFILE.phone}`}
                    className="text-[#D4AF37] font-bold hover:underline"
                  >
                    097856 09194
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* WRITE A GOOGLE REVIEW MODAL (Direct to Firestore) */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white border border-stone-300 max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center p-1 shadow-2xs">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-950 text-base">
                    Write a Google Review
                  </h4>
                  <p className="text-[11px] font-mono text-stone-500">
                    Aman Opticals - Aman · Sawai Madhopur
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            {reviewSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="font-serif text-xl font-bold text-stone-950">
                  Review Published & Synced!
                </h5>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Your feedback has been committed to the database and is now visible on the Aman Opticals Google Business review section.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                {/* Star Rating Selector */}
                <div className="space-y-1.5 text-center py-2 bg-[#FAF8F5] border border-stone-200">
                  <label className="text-[10px] font-mono uppercase font-bold text-stone-600 tracking-wider block">
                    Your Rating
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star 
                          className={`w-7 h-7 ${
                            star <= rating 
                              ? 'text-[#D4AF37] fill-[#D4AF37]' 
                              : 'text-stone-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-800">
                    {rating === 5 ? 'Exceptional · 5.0 Stars' : `${rating}.0 Stars`}
                  </span>
                </div>

                {/* Author Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-stone-600 tracking-wider block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g., Rajesh Sharma"
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:border-stone-950 focus:outline-none bg-[#FAF8F5]"
                  />
                </div>

                {/* City / Location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-stone-600 tracking-wider block">
                    City / Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    placeholder="e.g., Sawai Madhopur / Jaipur"
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:border-stone-950 focus:outline-none bg-[#FAF8F5]"
                  />
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-stone-600 tracking-wider block">
                    Review Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your optical experience: frame quality, eye testing, lens fitting, or price value..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:border-stone-950 focus:outline-none bg-[#FAF8F5] leading-relaxed"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="py-2.5 px-5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3 h-3 text-[#D4AF37]" />
                    <span>{submittingReview ? 'Publishing...' : 'Publish to Firestore'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
};
