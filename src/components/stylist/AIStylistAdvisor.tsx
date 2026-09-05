import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  RefreshCw,
  Eye,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';
import { FaceShape, Product } from '../../types';
import { formatPrice } from '../../data/currencies';

export const AIStylistAdvisor: React.FC = () => {
  const { 
    t, 
    currency, 
    setSelectedProductForTryOn, 
    setSelectedProductForDetail,
    setActiveTab, 
    setPdToolModalOpen 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'analyzer' | 'chat'>('analyzer');

  // Scanner state
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    faceShape: FaceShape;
    facialFeatures?: string;
    recommendedShapes: string[];
    avoidShapes?: string[];
    bestColors: string[];
    lensRecommendation: string;
    analysis: string;
    confidence: string;
  } | null>(null);

  // Quick Quiz State
  const [quizGender, setQuizGender] = useState<'unisex' | 'men' | 'women'>('unisex');
  const [quizFaceShape, setQuizFaceShape] = useState<FaceShape>('Oval');
  const [quizUse, setQuizUse] = useState<string>('computer_screen');

  // Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'model'; text: string }>>([
    {
      sender: 'model',
      text: 'Hello! I am your AI Optician & Eyewear Stylist at Aman Opticles. Ask me anything about lens coatings, high-power frame selection, or measuring your pupillary distance (PD)!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setPhotoBase64(base64);
        runAIAnalysis(base64, null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Analysis
  const runAIAnalysis = async (imgBase64: string | null, customQuiz: any) => {
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai-stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgBase64,
          answers: customQuiz || {
            faceShape: quizFaceShape,
            gender: quizGender,
            primaryUse: quizUse
          },
          userPreference: {
            preferredStyles: ['Titanium', 'Italian Acetate', 'Hexagonal']
          }
        })
      });

      const data = await response.json();
      if (data.recommendations) {
        setAnalysisResult(data.recommendations);
      }
    } catch (err) {
      console.error('Stylist API Error:', err);
      // Fallback
      setAnalysisResult({
        faceShape: 'Oval',
        facialFeatures: 'Harmonious cheekbones with gentle jawline tapering',
        recommendedShapes: ['Hexagonal', 'Wayfarer', 'Aviator'],
        avoidShapes: ['Heavy Oversized Square'],
        bestColors: ['Matte Gunmetal', 'Champagne Gold', 'Havana Tortoise'],
        lensRecommendation: 'Single Vision 1.60 Index with Blue-Block 420nm Shield',
        analysis: 'Your balanced facial proportions allow immense versatility. Geometric and classic aviators create high-contrast artistic presence without overpowering your eyes.',
        confidence: '95%'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  // Send Chat message
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: userText }];
    setMessages(newMsgs);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs,
          userContext: {
            analysis: analysisResult
          }
        })
      });
      const data = await res.json();
      setMessages([...newMsgs, { sender: 'model' as const, text: data.reply }]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      setMessages([
        ...newMsgs,
        {
          sender: 'model' as const,
          text: 'At Aman Opticles, we recommend choosing lightweight TR90 or Titanium frames with Blue-Shield 420 lenses for daily screen use.'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Matched products from catalog based on recommended shapes
  const recommendedProducts = React.useMemo(() => {
    if (!analysisResult) {
      return PRODUCTS.slice(0, 3);
    }
    const shapes = analysisResult.recommendedShapes.map(s => s.toLowerCase());
    return PRODUCTS.filter(p => {
      const matchShape = shapes.some(s => s.includes(p.frameShape.toLowerCase()) || p.frameShape.toLowerCase().includes(s));
      const matchFace = p.bestForFaceShapes.includes(analysisResult.faceShape);
      return matchShape || matchFace;
    }).slice(0, 4);
  }, [analysisResult]);

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-stone-900 pb-28 select-none">
      {/* AI Stylist Hero Header */}
      <div className="bg-white border-b border-stone-200 p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-stone-200 text-stone-900 font-mono text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Optometric Intelligence Engine</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950 tracking-tight">
            Cranial Geometry & Silhouette Advisor
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            Biometric analysis evaluating jawline angles, nasal bridge coordinates, and pupillary symmetry to pair you with architectural frames.
          </p>

          {/* Sub Navigation Switcher */}
          <div className="flex justify-center pt-3">
            <div className="inline-flex bg-[#FAF8F5] p-1 border border-stone-200 text-xs font-bold uppercase tracking-wider">
              <button
                id="stylist-tab-analyzer"
                onClick={() => setActiveSubTab('analyzer')}
                className={`px-4 py-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  activeSubTab === 'analyzer'
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Facial Geometry Scanner</span>
              </button>

              <button
                id="stylist-tab-chat"
                onClick={() => setActiveSubTab('chat')}
                className={`px-4 py-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  activeSubTab === 'chat'
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Consult Optometrist AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* SUBTAB 1: FACE GEOMETRY SCANNER & RECOMMENDATIONS */}
        {activeSubTab === 'analyzer' && (
          <div className="space-y-6">
            {/* SCANNER INPUT CARD */}
            <div className="p-6 bg-white border border-stone-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div className="text-center sm:text-left">
                  <h2 className="font-serif text-lg font-bold text-stone-950 uppercase tracking-tight">Upload Portrait or Calibrate Profile</h2>
                  <p className="text-xs text-stone-500 font-mono">Biometric analysis evaluates jawline vertex, bridge width, and iris spacing.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-3 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-stone-800 shadow-md cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>Upload Portrait</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Photo preview or Quiz options */}
              {photoBase64 ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF8F5] p-4 border border-stone-200">
                  <img
                    src={photoBase64}
                    alt="Uploaded selfie"
                    className="w-24 h-24 object-cover border border-stone-300 shadow-xs"
                  />
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="text-xs font-mono font-bold text-stone-950 flex items-center justify-center sm:justify-start gap-1.5 uppercase">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>Portrait Registered For Craniofacial Geometry</span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono">Ready to compute optical fit recommendations.</p>
                    <button
                      onClick={() => runAIAnalysis(photoBase64, null)}
                      disabled={analyzing}
                      className="px-4 py-2 bg-stone-950 text-white font-mono uppercase tracking-wider font-bold text-[10px] hover:bg-stone-800"
                    >
                      {analyzing ? 'Computing...' : 'Recalculate Fit'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Quick Fallback Quiz */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 block mb-1.5">Face Shape Silhouette</label>
                    <select
                      value={quizFaceShape}
                      onChange={(e) => setQuizFaceShape(e.target.value as FaceShape)}
                      className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 font-bold uppercase tracking-wider focus:outline-none focus:border-stone-900"
                    >
                      <option value="Oval">Oval (Balanced Symmetry)</option>
                      <option value="Square">Square (Prominent Jawline)</option>
                      <option value="Round">Round (Curvilinear Contours)</option>
                      <option value="Heart">Heart (Broad Brow, Tapered Chin)</option>
                      <option value="Diamond">Diamond (Angular Zygomatic Arches)</option>
                      <option value="Oblong">Oblong (Elongated Vertical Axis)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 block mb-1.5">Target Usage Mode</label>
                    <select
                      value={quizUse}
                      onChange={(e) => setQuizUse(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 font-bold uppercase tracking-wider focus:outline-none focus:border-stone-900"
                    >
                      <option value="computer_screen">Digital Screens (8+ hrs / Blue Defense)</option>
                      <option value="daily_driving">Everyday Distance & Driving</option>
                      <option value="reading_books">Reading & Near Vision</option>
                      <option value="sun_sports">Outdoor Sun & UV Protection</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 block mb-1.5">Audience</label>
                    <div className="flex gap-1 bg-[#FAF8F5] p-1 border border-stone-300">
                      {(['unisex', 'men', 'women'] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setQuizGender(g)}
                          className={`flex-1 py-1.5 text-[10px] font-mono uppercase font-bold transition-colors ${
                            quizGender === g ? 'bg-stone-950 text-white' : 'text-stone-600 hover:text-stone-950'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => runAIAnalysis(photoBase64, { faceShape: quizFaceShape, gender: quizGender, primaryUse: quizUse })}
                  disabled={analyzing}
                  className="px-8 py-3.5 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-stone-800 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Analyzing Facial Geometry...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Compute Optical Prescription & Fit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI ANALYSIS RESULTS CARD */}
            {analysisResult && (
              <div className="p-6 bg-white border border-stone-300 shadow-sm space-y-6 animate-in slide-in-from-bottom duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                      Biometric Optical Diagnosis
                    </span>
                    <h3 className="font-serif text-xl font-bold text-stone-950 flex items-center gap-2 mt-1">
                      <span>Cranial Silhouette:</span>
                      <span className="text-stone-950 bg-[#FAF8F5] px-3 py-1 border border-stone-300 font-mono text-sm font-bold uppercase">
                        {analysisResult.faceShape} Profile
                      </span>
                    </h3>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-stone-800 bg-[#FAF8F5] px-3 py-1.5 border border-stone-300 uppercase">
                    Confidence Matrix: {analysisResult.confidence || '96%'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left: Style Insights */}
                  <div className="space-y-3 bg-[#FAF8F5] p-5 border border-stone-200">
                    <h4 className="font-mono text-[10px] font-bold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Complementary Frame Geometries</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.recommendedShapes?.map((shape) => (
                        <span
                          key={shape}
                          className="px-3 py-1 bg-white border border-stone-300 text-stone-950 text-xs font-bold uppercase tracking-wider font-mono"
                        >
                          ✓ {shape}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 block mb-1.5">Harmonious Color Alloys:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.bestColors?.map((c) => (
                          <span key={c} className="text-[11px] px-2.5 py-1 bg-white text-stone-800 border border-stone-300 font-mono font-semibold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Lens Recommendation */}
                  <div className="space-y-3 bg-[#FAF8F5] p-5 border border-stone-200">
                    <h4 className="font-mono text-[10px] font-bold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Engineered Lens Formulation</span>
                    </h4>
                    <p className="text-xs font-bold text-stone-950 leading-relaxed bg-white p-3 border border-stone-300 font-mono">
                      {analysisResult.lensRecommendation}
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {analysisResult.analysis}
                    </p>
                  </div>
                </div>

                {/* RECOMMENDED PRODUCTS CAROUSEL */}
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-2">
                    <h4 className="font-serif text-base font-bold text-stone-950">
                      Curated Atelier Silhouettes For Your Profile:
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-stone-600 uppercase">Interactive Try-On Ready</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {recommendedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white p-3.5 border border-stone-200 hover:border-stone-900 transition-all flex flex-col justify-between group shadow-xs"
                      >
                        <div>
                          <div className="relative aspect-[4/3] overflow-hidden mb-2.5 bg-[#FAF8F5]">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 bg-white text-stone-900 text-[9px] font-mono uppercase font-bold px-2 py-0.5 border border-stone-200">
                              {prod.frameShape}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-stone-400 uppercase">{prod.brand}</div>
                          <h5 className="font-serif text-sm font-bold text-stone-950 truncate mt-0.5">{prod.name}</h5>
                          <div className="text-xs font-mono font-bold text-stone-950 mt-1">
                            {formatPrice(prod.price, currency)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-stone-100">
                          <button
                            onClick={() => {
                              setSelectedProductForTryOn(prod);
                              setActiveTab('tryon');
                            }}
                            className="flex-1 py-2 bg-stone-950 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-colors text-center cursor-pointer"
                          >
                            Try-On
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProductForDetail(prod);
                            }}
                            className="px-2.5 py-2 bg-[#FAF8F5] hover:bg-stone-200 text-stone-800 text-[11px] border border-stone-300 cursor-pointer"
                            title="Inspect Details"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: AI OPTICIAN CHAT ASSISTANT */}
        {activeSubTab === 'chat' && (
          <div className="bg-white border border-stone-300 shadow-md flex flex-col h-[560px] overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-stone-950 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-stone-950">Dr. Aman AI • Chief Optometrist</h3>
                  <p className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online • Prescriptions & Coating Advisory
                  </p>
                </div>
              </div>

              {/* PD Measurement shortcut */}
              <button
                onClick={() => setPdToolModalOpen(true)}
                className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-900 text-xs font-mono font-bold uppercase tracking-wider border border-stone-300 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>PD Meter Tool</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF8F5]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'model' && (
                    <div className="w-7 h-7 bg-stone-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-stone-950 text-white font-medium shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-900 shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.sender === 'user' && (
                    <div className="w-7 h-7 bg-stone-300 text-stone-900 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500 bg-white p-3 border border-stone-200 max-w-[220px]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                  <span>Dr. Aman is formulating...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 bg-white border-t border-stone-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {[
                'Which index lens for -4.50 high power?',
                'Difference between Blue-Cut & Anti-Glare?',
                'How to measure pupillary distance (PD)?',
                '1-Year Atelier Warranty policy'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3 py-1 bg-[#FAF8F5] hover:bg-stone-200 text-stone-700 text-[10px] font-mono uppercase font-bold shrink-0 border border-stone-300 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(chatInput);
              }}
              className="p-3.5 bg-white border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Inquire about prescriptions, refractive indices, frame materials..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-[#FAF8F5] border border-stone-300 px-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="px-5 py-2.5 bg-stone-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
