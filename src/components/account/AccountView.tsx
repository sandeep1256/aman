import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Eye, 
  Heart, 
  Camera, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Truck, 
  FileText, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  MapPin,
  ShoppingBag,
  LogOut,
  LogIn,
  Database,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, Prescription } from '../../types';
import { formatPrice } from '../../data/currencies';

export const AccountView: React.FC = () => {
  const { 
    user, 
    setAuthModalOpen,
    setAuthMode,
    logout,
    orders, 
    activeOrderToTrack, 
    setActiveOrderToTrack, 
    prescriptions, 
    savePrescription,
    deletePrescription,
    tryOnSnapshots, 
    wishlist, 
    toggleWishlist,
    addToCart,
    setSelectedProductForTryOn,
    products,
    currency, 
    t,
    setActiveTab,
    dbSyncStatus,
    isAdminMode,
    setIsAdminMode
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'prescriptions' | 'lookbook' | 'wishlist'>('orders');
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false);

  // New Prescription Form State
  const [newPrescName, setNewPrescName] = useState('Daily Screen Protection');
  const [rSph, setRSph] = useState('-1.50');
  const [rCyl, setRCyl] = useState('-0.50');
  const [rAxis, setRAxis] = useState('90');
  const [lSph, setLSph] = useState('-1.75');
  const [lCyl, setLCyl] = useState('-0.25');
  const [lAxis, setLAxis] = useState('85');
  const [pd, setPd] = useState(63);

  const selectedOrder = activeOrderToTrack || orders[0] || null;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Prescription = {
      savedName: newPrescName,
      type: 'single_vision',
      rightEye: { sph: rSph, cyl: rCyl, axis: rAxis },
      leftEye: { sph: lSph, cyl: lCyl, axis: lAxis },
      pd,
      date: new Date().toLocaleDateString()
    };
    await savePrescription(newP);
    setShowAddPrescriptionModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-stone-900 pb-28 select-none">
      {/* Top Profile Card */}
      <div className="bg-white border-b border-stone-200 p-6 sm:p-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-stone-950 flex items-center justify-center text-[#D4AF37] border border-stone-800 shadow-xs">
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-xl font-bold text-stone-950 leading-none">{user.displayName || user.email}</h1>
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-[#FAF8F5] text-stone-900 border border-stone-300">
                    {user.membershipTier} Member
                  </span>
                  {user.isAnonymous && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300">
                      Guest
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 font-mono mt-1.5">
                  {user.email} {user.phone ? `• ${user.phone}` : ''}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700">
                    <Database className="w-3 h-3" />
                    <span>Firestore Synced</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="text-[10px] font-mono text-stone-400 hover:text-rose-600 underline flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-2.5 h-2.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-stone-200 flex items-center justify-center text-stone-500 border border-stone-300">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-stone-950 leading-none">Welcome, Guest</h1>
                <p className="text-xs text-stone-500 font-mono mt-1.5">Sign in to save your prescriptions & sync orders.</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-stone-950 text-white font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-stone-800 cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-3 h-3 text-[#D4AF37]" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 text-stone-900 font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-stone-200 cursor-pointer"
                  >
                    Register (+500 Pts)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reward Points */}
          {user && (
            <div className="bg-[#FAF8F5] p-3.5 border border-stone-200 flex items-center gap-3.5">
              <div className="p-2 bg-white border border-stone-200 text-[#D4AF37]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-stone-500 uppercase font-mono font-bold">Atelier Privilege Points</div>
                <div className="text-lg font-bold text-stone-950 font-mono leading-none mt-0.5">
                  {user.rewardPoints.toLocaleString()} <span className="text-xs font-sans text-stone-600 font-normal">Pts</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="max-w-4xl mx-auto mt-6 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1">
          <div className="flex gap-2">
            {[
              { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
              { id: 'prescriptions', label: `Prescription Vault (${prescriptions.length})`, icon: Eye },
              { id: 'lookbook', label: `3D Lookbook (${tryOnSnapshots.length})`, icon: Camera },
              { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: Heart }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`px-4 py-2.5 border text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                      : 'bg-[#FAF8F5] border-stone-300 text-stone-600 hover:text-stone-950'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: ORDERS & REAL-TIME TIMELINE TRACKING */}
        {activeSubTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-stone-200 space-y-3">
                <Package className="w-12 h-12 mx-auto text-stone-400" />
                <h3 className="font-serif text-lg font-bold text-stone-950">No Orders Placed Yet</h3>
                <p className="text-xs text-stone-500 font-mono max-w-xs mx-auto">
                  Browse our designer sunglasses and spectacles catalog with virtual try-on and place your first order.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-6 py-3 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 cursor-pointer"
                >
                  Explore Sunglasses & Eyewear Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* LIVE ORDER TRACKER PANEL */}
                {selectedOrder && (
                  <div className="p-6 bg-white border border-stone-300 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                            Live Order Tracking (Firestore Synced)
                          </span>
                          <span className="text-xs font-mono font-bold bg-[#FAF8F5] px-2.5 py-0.5 text-stone-900 border border-stone-300">
                            #{selectedOrder.orderId}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 font-mono mt-1">
                          Placed on {new Date(selectedOrder.date || Date.now()).toLocaleDateString()} • {(selectedOrder.items || []).length} Eyewear Item(s)
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[9px] font-mono text-stone-500 uppercase font-bold">Estimated Delivery</div>
                          <div className="text-xs font-bold text-stone-950 font-mono">{selectedOrder.estimatedDelivery || 'In transit'}</div>
                        </div>
                        <div className="p-2 bg-[#FAF8F5] text-stone-900 border border-stone-300">
                          <Truck className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                      </div>
                    </div>

                    {/* Timeline Progress */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                        Optical Lab & Courier Dispatch Milestones:
                      </h4>

                      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                        {(selectedOrder.timeline || []).map((step, idx) => (
                          <div key={idx} className="relative">
                            {/* Circle Dot */}
                            <div className={`absolute -left-6 top-0.5 w-5 h-5 flex items-center justify-center ${
                              step.completed
                                ? 'bg-stone-950 text-[#D4AF37] border border-stone-950'
                                : 'bg-[#FAF8F5] border border-stone-300 text-stone-400'
                            }`}>
                              {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-mono font-bold ${step.completed ? 'text-stone-950' : 'text-stone-400'}`}>
                                  {step.title}
                                </span>
                                <span className="text-[10px] font-mono text-stone-400">({step.timestamp})</span>
                              </div>
                              <p className="text-[11px] text-stone-500 font-mono mt-0.5">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Items inside this order */}
                    <div className="pt-4 border-t border-stone-200">
                      <div className="text-[10px] font-mono uppercase font-bold text-stone-500 mb-3">Order Items Breakdown</div>
                      <div className="space-y-3">
                        {(selectedOrder.items || []).map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-stone-200">
                            <div className="flex items-center gap-3">
                              <img src={item.selectedColor?.frameImg || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'} alt={item.product?.name || 'Eyewear'} className="w-12 h-12 object-cover border border-stone-200 bg-white" />
                              <div>
                                <h5 className="font-serif text-xs font-bold text-stone-950">{item.product?.name || 'Eyewear Frame'}</h5>
                                <p className="text-[10px] text-stone-500 font-mono">
                                  Color: {item.selectedColor?.name || 'Standard'} • Lens: {item.lensOption?.name || 'Standard Optics'} (x{item.quantity || 1})
                                </p>
                              </div>
                            </div>
                            <div className="font-mono text-xs font-bold text-stone-950">
                              {formatPrice((item.unitPrice || 0) * (item.quantity || 1), currency)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders History List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">Order History Archive</h4>
                  {(orders || []).map((ord) => (
                    <div
                      key={ord.orderId}
                      onClick={() => setActiveOrderToTrack(ord)}
                      className={`p-4 bg-white border transition-all cursor-pointer flex items-center justify-between ${
                        selectedOrder?.orderId === ord.orderId ? 'border-stone-950 shadow-xs' : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-stone-950">Order #{ord.orderId}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF8F5] text-stone-800 border border-stone-300 uppercase">
                            {(ord.status || 'processing').replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono mt-1">
                          {new Date(ord.date || Date.now()).toLocaleDateString()} • {(ord.items || []).length} item(s) • Total: {formatPrice(ord.total || 0, currency)}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRESCRIPTION VAULT */}
        {activeSubTab === 'prescriptions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-950">Digital Prescription Vault</h3>
                <p className="text-xs text-stone-500 font-mono">Store optical powers for quick 1-click checkout.</p>
              </div>
              <button
                onClick={() => setShowAddPrescriptionModal(true)}
                className="px-4 py-2 bg-stone-950 text-white font-mono text-xs uppercase font-bold tracking-wider hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Add Prescription</span>
              </button>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-center py-12 bg-white border border-stone-200 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-stone-400" />
                <h4 className="font-serif text-base font-bold text-stone-950">No Prescriptions Saved</h4>
                <p className="text-xs text-stone-500 font-mono max-w-xs mx-auto">
                  Add your prescription numbers (SPH, CYL, AXIS, PD) to auto-configure eyeglasses.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map((p, idx) => (
                  <div key={idx} className="p-5 bg-white border border-stone-200 space-y-4 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-mono font-bold text-stone-950 uppercase">{p.savedName || `Prescription #${idx + 1}`}</div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">Type: {p.type} • PD: {p.pd}mm</div>
                      </div>
                      <button
                        onClick={() => deletePrescription(p.savedName || '')}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono border-t border-b border-stone-100 py-3">
                      <div className="p-2 bg-[#FAF8F5] border border-stone-200">
                        <div className="text-[9px] text-stone-500 font-bold uppercase">Right Eye (OD)</div>
                        <div className="text-stone-950 font-bold mt-1">SPH {p.rightEye.sph}</div>
                        <div className="text-[10px] text-stone-600">CYL {p.rightEye.cyl} • AX {p.rightEye.axis}°</div>
                      </div>
                      <div className="p-2 bg-[#FAF8F5] border border-stone-200">
                        <div className="text-[9px] text-stone-500 font-bold uppercase">Left Eye (OS)</div>
                        <div className="text-stone-950 font-bold mt-1">SPH {p.leftEye.sph}</div>
                        <div className="text-[10px] text-stone-600">CYL {p.leftEye.cyl} • AX {p.leftEye.axis}°</div>
                      </div>
                    </div>

                    {p.doctorName && (
                      <div className="text-[10px] text-stone-500 font-mono">
                        Verified by: <span className="text-stone-900 font-bold">{p.doctorName}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Modal for adding new prescription */}
            {showAddPrescriptionModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
                <div className="bg-white border border-stone-300 w-full max-w-md p-6 space-y-4 shadow-xl">
                  <h4 className="font-serif text-lg font-bold text-stone-950">Add Optical Prescription</h4>
                  <form onSubmit={handleCreatePrescription} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-600 mb-1">Prescription Label</label>
                      <input
                        type="text"
                        required
                        value={newPrescName}
                        onChange={(e) => setNewPrescName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone-600">OD SPH</label>
                        <input
                          type="text"
                          value={rSph}
                          onChange={(e) => setRSph(e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone-600">OD CYL</label>
                        <input
                          type="text"
                          value={rCyl}
                          onChange={(e) => setRCyl(e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone-600">OD AXIS</label>
                        <input
                          type="text"
                          value={rAxis}
                          onChange={(e) => setRAxis(e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone-600">OS SPH</label>
                        <input
                          type="text"
                          value={lSph}
                          onChange={(e) => setLSph(e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone-600">OS CYL</label>
                        <input
                          type="text"
                          value={lCyl}
                          onChange={(e) => setLCyl(e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-stone-600">OS AXIS</label>
                        <input
                          type="text"
                          value={lAxis}
                          onChange={(e) => setLAxis(e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-600 mb-1">Pupillary Distance (PD in mm)</label>
                      <input
                        type="number"
                        value={pd}
                        onChange={(e) => setPd(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddPrescriptionModal(false)}
                        className="flex-1 py-2 bg-[#FAF8F5] border border-stone-300 text-xs font-mono uppercase font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-stone-950 text-white text-xs font-mono uppercase font-bold hover:bg-stone-800"
                      >
                        Save to Database
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LOOKBOOK SNAPSHOTS */}
        {activeSubTab === 'lookbook' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-950">3D Virtual Lookbook</h3>
                <p className="text-xs text-stone-500 font-mono">Your virtual try-on recordings and captures.</p>
              </div>
              <button
                onClick={() => setActiveTab('tryon')}
                className="px-4 py-2 bg-stone-950 text-white font-mono text-xs uppercase font-bold tracking-wider hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Launch 3D Try-On</span>
              </button>
            </div>

            {tryOnSnapshots.length === 0 ? (
              <div className="text-center py-12 bg-white border border-stone-200 space-y-3">
                <Camera className="w-10 h-10 mx-auto text-stone-400" />
                <h4 className="font-serif text-base font-bold text-stone-950">No Lookbook Snapshots Yet</h4>
                <p className="text-xs text-stone-500 font-mono max-w-xs mx-auto">
                  Open the Virtual Try-On studio with your camera or model presets and click "Capture Snapshot".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tryOnSnapshots.map((snap) => (
                  <div key={snap.id} className="p-3 bg-white border border-stone-200 space-y-2 shadow-xs">
                    <img src={snap.image} alt={snap.productName} className="w-full aspect-[4/3] object-cover bg-stone-900 border border-stone-200" />
                    <div className="text-xs font-serif font-bold text-stone-950 truncate">{snap.productName}</div>
                    <div className="text-[10px] text-stone-500 font-mono">{snap.colorName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WISHLIST */}
        {activeSubTab === 'wishlist' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-950">Saved Wishlist</h3>
              <p className="text-xs text-stone-500 font-mono">Curated pieces you marked as favorites.</p>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="text-center py-12 bg-white border border-stone-200 space-y-3">
                <Heart className="w-10 h-10 mx-auto text-stone-400" />
                <h4 className="font-serif text-base font-bold text-stone-950">Your Wishlist is Empty</h4>
                <p className="text-xs text-stone-500 font-mono max-w-xs mx-auto">
                  Click the heart icon on any frame in the sunglasses or spectacles catalog to save it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishlistProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 bg-white border border-stone-200 flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="relative aspect-[4/3] overflow-hidden mb-2.5 bg-[#FAF8F5]">
                        <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer border border-stone-200"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-600" />
                        </button>
                      </div>
                      <div className="text-[10px] font-mono text-stone-400 uppercase">{prod.brand}</div>
                      <h4 className="font-serif text-sm font-bold text-stone-950 truncate mt-0.5">{prod.name}</h4>
                      <div className="text-xs font-mono font-bold text-stone-950 mt-1">
                        {formatPrice(prod.price, currency)}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 pt-2.5 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setSelectedProductForTryOn(prod);
                          setActiveTab('tryon');
                        }}
                        className="flex-1 py-2 bg-[#FAF8F5] hover:bg-stone-200 text-stone-900 font-mono uppercase font-bold text-[10px] border border-stone-300 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Try-On</span>
                      </button>
                      <button
                        onClick={() => addToCart(prod, prod.colors[0])}
                        className="flex-1 py-2 bg-stone-950 hover:bg-stone-800 text-white font-mono uppercase font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Owner / Staff Terminal Access */}
        <div className="pt-6 pb-2 flex items-center justify-between border-t border-stone-200">
          <div className="text-[11px] font-mono text-stone-400">
            Internal Atelier Access
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className="text-[11px] font-mono text-stone-600 hover:text-stone-950 flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 border border-stone-300 hover:border-stone-950 bg-stone-50"
          >
            <Lock className="w-3 h-3 text-[#D4AF37]" />
            <span>Store Owner & Staff Terminal</span>
          </button>
        </div>

        {/* Optical Assurance Guarantee Footer */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Aman Opticles Atelier • 100% Precision Optical Grade Surfacing</span>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            ISO 8980-2 Optical Standards • Certified Dispensing
          </span>
        </div>
      </div>
    </div>
  );
};
