import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Trash2, 
  Edit3, 
  Printer, 
  RefreshCw, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ChevronDown, 
  X, 
  Glasses, 
  FileText,
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, CartItem, Product, LensOption, Prescription, PaymentMethodType, OrderTimelineStep } from '../../types';
import { formatPrice } from '../../data/currencies';
import { LENS_OPTIONS } from '../../data/lenses';
import { DoctorSlipViewerModal } from '../common/DoctorSlipViewerModal';
import { PrescriptionSlipUploader, UploadedSlipData } from '../common/PrescriptionSlipUploader';

export const AdminOrderManager: React.FC = () => {
  const { 
    orders, 
    products, 
    currency, 
    adminAddOrder, 
    adminUpdateOrder, 
    adminDeleteOrder, 
    fetchAllStoreOrders,
    setActiveOrderToTrack
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrderForJobSheet, setSelectedOrderForJobSheet] = useState<Order | null>(null);
  const [editingOrderCourier, setEditingOrderCourier] = useState<Order | null>(null);
  const [courierNameInput, setCourierNameInput] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [estimatedDeliveryInput, setEstimatedDeliveryInput] = useState('');
  const [viewingSlipPrescription, setViewingSlipPrescription] = useState<Prescription | null>(null);

  // ----------------------------------------------------
  // MANUAL ORDER CREATION FORM STATE
  // ----------------------------------------------------
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerStreet, setCustomerStreet] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [customerPincode, setCustomerPincode] = useState('');
  const [manualOrderSlip, setManualOrderSlip] = useState<UploadedSlipData | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [selectedLensId, setSelectedLensId] = useState<string>(LENS_OPTIONS[0]?.id || '');
  const [isPrescriptionRequired, setIsPrescriptionRequired] = useState(true);

  // Prescription values
  const [rSph, setRSph] = useState('-1.50');
  const [rCyl, setRCyl] = useState('-0.50');
  const [rAxis, setRAxis] = useState('90');
  const [lSph, setLSph] = useState('-1.25');
  const [lCyl, setLCyl] = useState('-0.50');
  const [lAxis, setLAxis] = useState('85');
  const [pdValue, setPdValue] = useState('63');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');

  // Handle live database refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllStoreOrders();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return (orders || []).filter(order => {
      // Status match
      if (statusFilter !== 'all') {
        if (statusFilter === 'in_lab') {
          if (!['confirmed', 'lens_crafting', 'precision_fitting', 'quality_check'].includes(order.status)) {
            return false;
          }
        } else if (order.status !== statusFilter) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const idMatch = (order.orderId || '').toLowerCase().includes(query);
        const nameMatch = (order.shippingAddress?.fullName || '').toLowerCase().includes(query);
        const phoneMatch = (order.shippingAddress?.phone || '').includes(query);
        const cityMatch = (order.shippingAddress?.city || '').toLowerCase().includes(query);
        const frameMatch = (order.items || []).some(item => 
          (item.product?.name || '').toLowerCase().includes(query)
        );
        return idMatch || nameMatch || phoneMatch || cityMatch || frameMatch;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Order Metrics Calculations
  const metrics = useMemo(() => {
    const totalCount = (orders || []).length;
    const inLabCount = (orders || []).filter(o => 
      ['confirmed', 'lens_crafting', 'precision_fitting', 'quality_check'].includes(o.status)
    ).length;
    const dispatchedCount = (orders || []).filter(o => 
      ['dispatched', 'out_for_delivery'].includes(o.status)
    ).length;
    const deliveredCount = (orders || []).filter(o => o.status === 'delivered').length;
    const totalRevenue = (orders || []).reduce((acc, curr) => acc + (curr.total || 0), 0);

    return { totalCount, inLabCount, dispatchedCount, deliveredCount, totalRevenue };
  }, [orders]);

  // Status progression map
  const getNextStatus = (current: Order['status']): { nextStatus: Order['status']; label: string; stepTitle: string; stepDesc: string } | null => {
    switch (current) {
      case 'confirmed':
        return {
          nextStatus: 'lens_crafting',
          label: 'Start Lens Crafting',
          stepTitle: 'Digital Lens Surfacing & Coating',
          stepDesc: 'Optometric lab robotic edging & AR diamond anti-reflective hard coat applied'
        };
      case 'lens_crafting':
        return {
          nextStatus: 'precision_fitting',
          label: 'Move to Frame Fitting',
          stepTitle: 'Atelier Precision Frame Mounting',
          stepDesc: 'Lenses laser-aligned and mounted into bespoke eyewear chassis'
        };
      case 'precision_fitting':
        return {
          nextStatus: 'quality_check',
          label: 'Perform Quality Check',
          stepTitle: 'Master Optician 24-Point Inspection',
          stepDesc: 'Optical focal center verified with electronic lensometer and UV400 spectrometer'
        };
      case 'quality_check':
        return {
          nextStatus: 'dispatched',
          label: 'Dispatch Eyewear',
          stepTitle: 'Dispatched with Secure Courier',
          stepDesc: 'Package sealed in velvet-lined protective case and handed to logistics courier'
        };
      case 'dispatched':
        return {
          nextStatus: 'out_for_delivery',
          label: 'Mark Out for Delivery',
          stepTitle: 'Out for Local Courier Delivery',
          stepDesc: 'Rider is en route to customer destination address'
        };
      case 'out_for_delivery':
        return {
          nextStatus: 'delivered',
          label: 'Mark Delivered',
          stepTitle: 'Handed to Patron',
          stepDesc: 'Luxury eyewear delivered successfully to recipient with warranty seal'
        };
      default:
        return null;
    }
  };

  // Quick 1-Click Status Advancement
  const handleAdvanceStatus = async (order: Order) => {
    const next = getNextStatus(order.status);
    if (!next) return;

    const newStep: OrderTimelineStep = {
      status: next.nextStatus,
      title: next.stepTitle,
      description: next.stepDesc,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      completed: true
    };

    const updatedTimeline = [...(order.timeline || []), newStep];
    await adminUpdateOrder(order.orderId, {
      status: next.nextStatus,
      timeline: updatedTimeline
    });
  };

  // Save Courier Tracking updates
  const handleSaveCourierDetails = async () => {
    if (!editingOrderCourier) return;
    await adminUpdateOrder(editingOrderCourier.orderId, {
      courierPartner: courierNameInput || editingOrderCourier.courierPartner,
      trackingNumber: trackingNumberInput || editingOrderCourier.trackingNumber,
      estimatedDelivery: estimatedDeliveryInput || editingOrderCourier.estimatedDelivery
    });
    setEditingOrderCourier(null);
  };

  // Create Manual Order Submission
  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please enter at least customer name and phone number');
      return;
    }

    const product = products.find(p => p.id === selectedProductId) || products[0];
    const color = product.colors[selectedColorIndex] || product.colors[0];
    const lens = LENS_OPTIONS.find(l => l.id === selectedLensId) || LENS_OPTIONS[0];

    const prescription: Prescription | undefined = isPrescriptionRequired ? {
      type: lens.category === 'progressive_bifocal' ? 'bifocal_progressive' : 'single_vision',
      rightEye: { sph: rSph, cyl: rCyl, axis: rAxis },
      leftEye: { sph: lSph, cyl: lCyl, axis: lAxis },
      pd: parseFloat(pdValue) || 63,
      doctorName: manualOrderSlip?.doctorName || 'Aman Opticles Clinic',
      clinicName: manualOrderSlip?.clinicName,
      prescriptionFileUrl: manualOrderSlip?.fileUrl,
      prescriptionFileName: manualOrderSlip?.fileName,
      prescriptionFileType: manualOrderSlip?.fileType,
      prescriptionFileSize: manualOrderSlip?.fileSize,
      notes: manualOrderSlip?.notes,
      savedName: `${customerName} - Prescription`,
      date: new Date().toISOString()
    } : undefined;

    const unitPrice = product.price + lens.price;
    const cartItem: CartItem = {
      cartItemId: `walkin-item-${Date.now()}`,
      product,
      selectedColor: color,
      lensOption: lens,
      prescription,
      quantity: 1,
      unitPrice
    };

    const subtotal = unitPrice;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    const orderId = `AMAN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      orderId,
      date: new Date().toISOString(),
      items: [cartItem],
      shippingAddress: {
        fullName: customerName,
        phone: customerPhone,
        email: customerEmail || 'walkin@amanopticles.com',
        street: customerStreet || 'In-Store Walkin / Boutique Collection',
        city: customerCity || 'Mumbai',
        state: customerState || 'Maharashtra',
        pincode: customerPincode || '400001',
        country: 'India',
        type: 'home'
      },
      paymentMethod,
      paymentStatus,
      paymentDetails: {
        transactionId: `TXN-POS-${Date.now()}`,
        methodTitle: paymentMethod.toUpperCase(),
        upiId: paymentMethod === 'upi' ? `${customerPhone}@upi` : undefined
      },
      subtotal,
      discount: 0,
      shipping: 0,
      tax,
      total,
      currency: 'INR',
      status: 'confirmed',
      timeline: [
        {
          status: 'confirmed',
          title: 'Order Created by Store Optician',
          description: 'Prescription verified and queued for optical surfacing lab',
          timestamp: 'Just now',
          completed: true
        }
      ],
      trackingNumber: `AMAN-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      courierPartner: 'Blue Dart Express',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    const success = await adminAddOrder(newOrder);
    if (success) {
      setIsCreateModalOpen(false);
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setCustomerStreet('');
      setCustomerCity('');
      setManualOrderSlip(null);
    }
  };

  return (
    <div id="admin-orders-manager" className="space-y-6">
      {/* Top Operations Header */}
      <div className="bg-stone-950 text-white p-6 border border-stone-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#D4AF37] text-stone-950 text-[10px] font-mono font-bold tracking-widest uppercase">
                ADMIN STORE PORTAL
              </span>
              <span className="text-xs font-mono text-stone-400">Live Optical Lab & Order Hub</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mt-1">
              Order Fulfillment & Management
            </h2>
            <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
              Track customer orders, manage lab craftsmanship stages, dispatch eyewear with live tracking numbers, or create manual in-store walk-in orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-refresh-db-btn"
              onClick={handleRefresh}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-mono font-bold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>

            <button
              id="admin-create-manual-order-btn"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2f] text-stone-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create In-Store Order</span>
            </button>
          </div>
        </div>

        {/* Real-time Order Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-stone-800">
          <div className="bg-stone-900/80 p-3 border border-stone-800">
            <div className="text-[10px] font-mono uppercase text-stone-400 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-stone-400" /> Total Orders
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">{metrics.totalCount}</div>
          </div>

          <div className="bg-stone-900/80 p-3 border border-amber-900/40">
            <div className="text-[10px] font-mono uppercase text-amber-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> In Optical Lab
            </div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-1">{metrics.inLabCount}</div>
          </div>

          <div className="bg-stone-900/80 p-3 border border-blue-900/40">
            <div className="text-[10px] font-mono uppercase text-blue-300 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-400" /> Dispatched
            </div>
            <div className="text-xl font-bold font-mono text-blue-300 mt-1">{metrics.dispatchedCount}</div>
          </div>

          <div className="bg-stone-900/80 p-3 border border-emerald-900/40">
            <div className="text-[10px] font-mono uppercase text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Delivered
            </div>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-1">{metrics.deliveredCount}</div>
          </div>

          <div className="bg-stone-900/80 p-3 border border-[#D4AF37]/40 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono uppercase text-[#D4AF37] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" /> Revenue
            </div>
            <div className="text-base font-bold font-mono text-[#D4AF37] mt-1">
              {formatPrice(metrics.totalRevenue, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Filters, Status Tabs & Search Bar */}
      <div className="bg-white p-4 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="admin-search-orders-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer, phone, city, frame..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'in_lab', label: '🔬 In Lab' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'quality_check', label: 'Quality Check' },
            { id: 'dispatched', label: 'Dispatched' },
            { id: 'delivered', label: 'Delivered' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono font-bold whitespace-nowrap border transition-all ${
                statusFilter === tab.id
                  ? 'bg-stone-950 text-white border-stone-950'
                  : 'bg-[#FAF8F5] text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 border border-stone-200 text-center space-y-3">
          <Package className="w-12 h-12 text-stone-300 mx-auto stroke-1" />
          <h3 className="font-serif text-lg font-bold text-stone-900">No matching store orders found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try changing your search query or filter status tabs.' 
              : 'Create a new in-store order or wait for customer online checkouts.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-3 px-4 py-2 bg-stone-950 text-white text-xs font-mono font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" /> Create In-Store Order
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const nextAction = getNextStatus(order.status);
            const firstItem = order.items?.[0];
            const hasPrescription = (order.items || []).some(item => !!item.prescription);

            return (
              <div 
                key={order.orderId}
                className="bg-white border border-stone-200 shadow-sm hover:border-stone-400 transition-all overflow-hidden"
              >
                {/* Card Top Row */}
                <div className="p-4 bg-[#FAF8F5] border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-950">
                          #{order.orderId}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase border ${
                          order.status === 'delivered' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'dispatched' || order.status === 'out_for_delivery'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 uppercase border ${
                          order.paymentStatus === 'paid'
                            ? 'bg-stone-900 text-[#D4AF37] border-stone-950 font-bold'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                        Placed on {new Date(order.date || Date.now()).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] font-mono uppercase text-stone-500 font-bold">Total Amount</div>
                      <div className="text-sm font-bold font-mono text-stone-950">
                        {formatPrice(order.total || 0, currency)}
                      </div>
                    </div>

                    {/* Quick 1-Click Status Advancement Button */}
                    {nextAction && (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        className="px-3.5 py-1.5 bg-stone-950 hover:bg-stone-800 text-[#D4AF37] border border-stone-800 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all"
                        title={`Advance to: ${nextAction.nextStatus}`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{nextAction.label}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Middle: Customer Details, Items & Optical Prescription Breakdown */}
                <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Column 1: Customer Contact & Shipping */}
                  <div className="space-y-2 text-xs border-b lg:border-b-0 lg:border-r border-stone-100 pr-4 pb-3 lg:pb-0">
                    <div className="text-[10px] font-mono uppercase font-bold text-stone-500 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#D4AF37]" /> Customer Profile
                    </div>
                    <div className="font-serif font-bold text-stone-900 text-sm">
                      {order.shippingAddress?.fullName || 'Walk-in Patron'}
                    </div>
                    <div className="text-stone-600 flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="w-3 h-3 text-stone-400" />
                      {order.shippingAddress?.phone || 'No phone'}
                    </div>
                    <div className="text-stone-600 flex items-start gap-1.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                      <span>
                        {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </span>
                    </div>
                    <div className="pt-2 text-[10px] font-mono text-stone-500">
                      Payment: <strong className="text-stone-800 uppercase">{order.paymentMethod}</strong> • Method: {order.paymentDetails?.methodTitle || 'Direct'}
                    </div>
                  </div>

                  {/* Column 2: Items & Lens Specification */}
                  <div className="space-y-3 lg:col-span-2">
                    <div className="text-[10px] font-mono uppercase font-bold text-stone-500 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Glasses className="w-3.5 h-3.5 text-[#D4AF37]" /> Eyewear & Lens Specifications ({(order.items || []).length} Item)
                      </span>
                      {hasPrescription && (
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 text-[9px] font-mono font-bold">
                          PRESCRIPTION VERIFIED
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.selectedColor?.frameImg || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'} 
                              alt={item.product?.name || 'Frame'} 
                              className="w-12 h-12 object-cover border border-stone-200 bg-white shrink-0" 
                            />
                            <div>
                              <div className="font-serif font-bold text-stone-950">
                                {item.product?.name || 'Eyewear Frame'}
                              </div>
                              <div className="text-[10px] text-stone-500 font-mono">
                                Color: <strong className="text-stone-800">{item.selectedColor?.name}</strong> • Lens: <strong className="text-stone-800">{item.lensOption?.name}</strong> (Index: {item.lensOption?.index || '1.56'})
                              </div>
                              {/* Prescription Values if attached */}
                              {item.prescription && (
                                <div className="mt-1.5 space-y-1">
                                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono bg-white p-1.5 border border-stone-200 text-stone-700">
                                    <span>OD: {item.prescription.rightEye?.sph} / {item.prescription.rightEye?.cyl} @ {item.prescription.rightEye?.axis}°</span>
                                    <span>•</span>
                                    <span>OS: {item.prescription.leftEye?.sph} / {item.prescription.leftEye?.cyl} @ {item.prescription.leftEye?.axis}°</span>
                                    <span>•</span>
                                    <span>PD: {item.prescription.pd || 63}mm</span>
                                    {item.prescription.doctorName && (
                                      <span>• Dr. {item.prescription.doctorName}</span>
                                    )}
                                  </div>

                                  {item.prescription.prescriptionFileUrl && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                        <FileText className="w-3 h-3 text-emerald-600" />
                                        <span>Customer Uploaded Slip ({item.prescription.prescriptionFileType === 'pdf' ? 'PDF' : 'Image'})</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setViewingSlipPrescription(item.prescription!)}
                                        className="text-[10px] font-mono font-bold uppercase text-stone-900 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 border border-stone-300 flex items-center gap-1 cursor-pointer"
                                      >
                                        <Eye className="w-3 h-3 text-[#D4AF37]" />
                                        <span>View Doctor Slip</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right font-mono font-bold text-stone-900 shrink-0">
                            {formatPrice((item.unitPrice || 0) * (item.quantity || 1), currency)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Logistics, Optical Job Card & Action Controls */}
                <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Courier & Tracking info */}
                  <div className="flex items-center gap-3 text-stone-600 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-stone-500" />
                      <span>Carrier: <strong className="text-stone-900">{order.courierPartner || 'Blue Dart Express'}</strong></span>
                    </div>
                    <span>•</span>
                    <div>
                      <span>AWB: <strong className="text-stone-900">{order.trackingNumber || 'Pending'}</strong></span>
                    </div>
                    <span>•</span>
                    <div>
                      <span>Est: <strong className="text-stone-900">{order.estimatedDelivery || '3-5 Days'}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* View Optical Job Sheet / Invoice */}
                    <button
                      onClick={() => setSelectedOrderForJobSheet(order)}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-[11px] font-mono font-bold flex items-center gap-1 transition-colors"
                      title="Generate Optometric Lab Job Sheet & Invoice"
                    >
                      <FileText className="w-3 h-3 text-[#D4AF37]" />
                      <span>Optical Job Card</span>
                    </button>

                    {/* Edit Courier Logistics */}
                    <button
                      onClick={() => {
                        setEditingOrderCourier(order);
                        setCourierNameInput(order.courierPartner || 'Blue Dart Express');
                        setTrackingNumberInput(order.trackingNumber || '');
                        setEstimatedDeliveryInput(order.estimatedDelivery || '');
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-[11px] font-mono font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-stone-600" />
                      <span>Logistics</span>
                    </button>

                    {/* Customer View Simulation */}
                    <button
                      onClick={() => setActiveOrderToTrack(order)}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-[11px] font-mono font-bold flex items-center gap-1 transition-colors"
                      title="View Customer Tracking Milestone Page"
                    >
                      <Eye className="w-3 h-3 text-stone-600" />
                      <span>Track Timeline</span>
                    </button>

                    {/* Delete Order */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove Order #${order.orderId}?`)) {
                          adminDeleteOrder(order.orderId);
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Cancel and Delete Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL 1: CREATE MANUAL / WALK-IN IN-STORE ORDER
      ---------------------------------------------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-stone-300 shadow-2xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-4 bg-stone-950 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-base">New In-Store Walk-In Order</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="p-6 space-y-6">
              {/* Section 1: Customer Contact Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 border-b border-stone-200 pb-1">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" /> 1. Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="patron@gmail.com"
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={customerStreet}
                      onChange={e => setCustomerStreet(e.target.value)}
                      placeholder="Flat 402, Signature Tower"
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">City</label>
                    <input
                      type="text"
                      value={customerCity}
                      onChange={e => setCustomerCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={customerPincode}
                      onChange={e => setCustomerPincode(e.target.value)}
                      placeholder="400001"
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Frame & Lens Selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 border-b border-stone-200 pb-1">
                  <Glasses className="w-3.5 h-3.5 text-[#D4AF37]" /> 2. Eyewear & Lens Selection
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">Select Frame Model</label>
                    <select
                      value={selectedProductId}
                      onChange={e => {
                        setSelectedProductId(e.target.value);
                        setSelectedColorIndex(0);
                      }}
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-mono"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.brand}) - {formatPrice(p.price, 'INR')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">Select Optical Lens Package</label>
                    <select
                      value={selectedLensId}
                      onChange={e => setSelectedLensId(e.target.value)}
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-mono"
                    >
                      {LENS_OPTIONS.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.name} (+{formatPrice(l.price, 'INR')}) - {l.index}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Optometric Prescription */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> 3. Optical Prescription Parameters
                  </h4>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer font-mono">
                    <input
                      type="checkbox"
                      checked={isPrescriptionRequired}
                      onChange={e => setIsPrescriptionRequired(e.target.checked)}
                      className="rounded text-stone-950 focus:ring-0"
                    />
                    Include Power Parameters
                  </label>
                </div>

                {isPrescriptionRequired && (
                  <div className="space-y-3 bg-[#FAF8F5] p-3 border border-stone-200">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono text-stone-500 font-bold uppercase">
                      <div>Eye</div>
                      <div>SPH (Power)</div>
                      <div>CYL (Astigmatism)</div>
                      <div>AXIS (Degrees)</div>
                    </div>

                    {/* Right Eye */}
                    <div className="grid grid-cols-4 gap-2 items-center text-xs">
                      <span className="font-mono font-bold text-stone-800">OD (Right)</span>
                      <input
                        type="text"
                        value={rSph}
                        onChange={e => setRSph(e.target.value)}
                        placeholder="-1.50"
                        className="p-1.5 bg-white border border-stone-300 text-xs text-center font-mono"
                      />
                      <input
                        type="text"
                        value={rCyl}
                        onChange={e => setRCyl(e.target.value)}
                        placeholder="-0.50"
                        className="p-1.5 bg-white border border-stone-300 text-xs text-center font-mono"
                      />
                      <input
                        type="text"
                        value={rAxis}
                        onChange={e => setRAxis(e.target.value)}
                        placeholder="90"
                        className="p-1.5 bg-white border border-stone-300 text-xs text-center font-mono"
                      />
                    </div>

                    {/* Left Eye */}
                    <div className="grid grid-cols-4 gap-2 items-center text-xs">
                      <span className="font-mono font-bold text-stone-800">OS (Left)</span>
                      <input
                        type="text"
                        value={lSph}
                        onChange={e => setLSph(e.target.value)}
                        placeholder="-1.25"
                        className="p-1.5 bg-white border border-stone-300 text-xs text-center font-mono"
                      />
                      <input
                        type="text"
                        value={lCyl}
                        onChange={e => setLCyl(e.target.value)}
                        placeholder="-0.50"
                        className="p-1.5 bg-white border border-stone-300 text-xs text-center font-mono"
                      />
                      <input
                        type="text"
                        value={lAxis}
                        onChange={e => setLAxis(e.target.value)}
                        placeholder="85"
                        className="p-1.5 bg-white border border-stone-300 text-xs text-center font-mono"
                      />
                    </div>

                    {/* Pupillary distance */}
                    <div className="flex items-center gap-4 pt-2 border-t border-stone-200 text-xs font-mono">
                      <span>Pupillary Distance (PD):</span>
                      <input
                        type="number"
                        value={pdValue}
                        onChange={e => setPdValue(e.target.value)}
                        className="w-20 p-1 bg-white border border-stone-300 text-center font-mono text-xs"
                      />
                      <span className="text-stone-500">mm</span>
                    </div>

                    {/* Slip Uploader for Store Walk-in */}
                    <div className="pt-2 border-t border-stone-200">
                      <div className="text-[10px] font-mono font-bold uppercase text-stone-600 mb-1.5">
                        Attach Doctor's Slip / Rx Document (Image or PDF)
                      </div>
                      <PrescriptionSlipUploader
                        initialData={manualOrderSlip || undefined}
                        onSlipChange={setManualOrderSlip}
                        showDoctorFields={true}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Payment Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 border-b border-stone-200 pb-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" /> 4. Payment Settlement
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value as PaymentMethodType)}
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 font-mono uppercase"
                    >
                      <option value="upi">UPI / QR Code</option>
                      <option value="card">Credit / Debit Card</option>
                      <option value="cod">Cash on Store Desk</option>
                      <option value="netbanking">Net Banking</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={e => setPaymentStatus(e.target.value as 'paid' | 'pending')}
                      className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs text-stone-900 font-mono uppercase"
                    >
                      <option value="paid">PAID (Settled)</option>
                      <option value="pending">PENDING (Pay on Delivery)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Generate & Save Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL 2: OPTICAL JOB SHEET & INVOICE PRINTER
      ---------------------------------------------------- */}
      {selectedOrderForJobSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-stone-400 shadow-2xl p-6 space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-base text-stone-950">
                  Optical Lab Job Card & Invoice #{selectedOrderForJobSheet.orderId}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-stone-950 text-white text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D4AF37]" /> Print
                </button>
                <button
                  onClick={() => setSelectedOrderForJobSheet(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Sheet Body */}
            <div className="space-y-6 font-sans text-xs text-stone-900 border p-6 bg-white border-stone-300">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-stone-300 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-950 tracking-wide">AMAN OPTICLES</h2>
                  <p className="text-[10px] font-mono text-stone-500">Haute Lunetterie & Precision Optical Lab</p>
                  <p className="text-[10px] text-stone-600 mt-1">Heritage Atelier, Fort, Mumbai • GSTIN: 27AABCA1234F1Z5</p>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="font-bold text-stone-950">JOB #{selectedOrderForJobSheet.orderId}</div>
                  <div className="text-stone-500">Date: {new Date(selectedOrderForJobSheet.date).toLocaleDateString()}</div>
                  <div className="text-stone-500">Status: {selectedOrderForJobSheet.status.toUpperCase()}</div>
                </div>
              </div>

              {/* Patron & Shipping */}
              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-3 border border-stone-200">
                <div>
                  <div className="text-[10px] font-mono uppercase text-stone-500 font-bold">Patron / Patient:</div>
                  <div className="font-bold text-stone-950">{selectedOrderForJobSheet.shippingAddress?.fullName}</div>
                  <div>Phone: {selectedOrderForJobSheet.shippingAddress?.phone}</div>
                  <div>Email: {selectedOrderForJobSheet.shippingAddress?.email}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-stone-500 font-bold">Delivery Destination:</div>
                  <div>{selectedOrderForJobSheet.shippingAddress?.street}</div>
                  <div>{selectedOrderForJobSheet.shippingAddress?.city}, {selectedOrderForJobSheet.shippingAddress?.state}</div>
                  <div>Pincode: {selectedOrderForJobSheet.shippingAddress?.pincode}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase font-bold text-stone-500">Eyewear Assembly Specifications:</div>
                <table className="w-full text-left border-collapse border border-stone-200 text-xs">
                  <thead>
                    <tr className="bg-stone-100 font-mono text-[10px] uppercase">
                      <th className="p-2 border border-stone-200">Frame Model</th>
                      <th className="p-2 border border-stone-200">Color</th>
                      <th className="p-2 border border-stone-200">Lens Specification</th>
                      <th className="p-2 border border-stone-200 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrderForJobSheet.items || []).map((item, idx) => (
                      <tr key={idx} className="border-t border-stone-200">
                        <td className="p-2 border border-stone-200 font-serif font-bold">{item.product?.name}</td>
                        <td className="p-2 border border-stone-200">{item.selectedColor?.name}</td>
                        <td className="p-2 border border-stone-200">
                          <div>{item.lensOption?.name}</div>
                          <div className="text-[10px] font-mono text-stone-500">Refractive Index: {item.lensOption?.index}</div>
                        </td>
                        <td className="p-2 border border-stone-200 text-right font-mono font-bold">
                          {formatPrice(item.unitPrice, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Optical Prescription Box */}
              {(selectedOrderForJobSheet.items || []).some(i => i.prescription) && (
                <div className="p-3 border-2 border-stone-900 bg-stone-50 space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-950 flex items-center justify-between">
                    <span>🔬 Optician Lab Fabrication Prescription</span>
                    <span className="text-[10px] font-normal text-stone-600">Standard Tolerances: ISO 8980-2</span>
                  </div>
                  {(selectedOrderForJobSheet.items || []).map((item, i) => item.prescription && (
                    <div key={i} className="text-xs font-mono space-y-1">
                      <div className="grid grid-cols-4 gap-2 text-center bg-white p-2 border border-stone-300">
                        <div><strong>Eye</strong></div>
                        <div><strong>SPH</strong></div>
                        <div><strong>CYL</strong></div>
                        <div><strong>AXIS</strong></div>
                        <div>OD (Right)</div>
                        <div>{item.prescription.rightEye?.sph || '0.00'}</div>
                        <div>{item.prescription.rightEye?.cyl || '0.00'}</div>
                        <div>{item.prescription.rightEye?.axis || '0'}°</div>
                        <div>OS (Left)</div>
                        <div>{item.prescription.leftEye?.sph || '0.00'}</div>
                        <div>{item.prescription.leftEye?.cyl || '0.00'}</div>
                        <div>{item.prescription.leftEye?.axis || '0'}°</div>
                      </div>
                      <div className="text-[11px] text-stone-700 pt-1 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          Measured Pupillary Distance (PD): <strong>{item.prescription.pd || 63} mm</strong>
                          {item.prescription.doctorName && (
                            <span className="ml-2">• Prescribed by: Dr. <strong>{item.prescription.doctorName}</strong> {item.prescription.clinicName ? `(${item.prescription.clinicName})` : ''}</span>
                          )}
                        </div>
                        {item.prescription.prescriptionFileUrl && (
                          <button
                            type="button"
                            onClick={() => setViewingSlipPrescription(item.prescription!)}
                            className="px-2 py-1 bg-stone-950 text-white font-mono text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer hover:bg-stone-800"
                          >
                            <Eye className="w-3 h-3 text-[#D4AF37]" />
                            <span>View Original Doctor Slip ({item.prescription.prescriptionFileType === 'pdf' ? 'PDF' : 'Image'})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="flex justify-end pt-3 border-t border-stone-300">
                <div className="w-64 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrderForJobSheet.subtotal || 0, currency)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>GST (18%):</span>
                    <span>{formatPrice(selectedOrderForJobSheet.tax || 0, currency)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-stone-950 border-t border-stone-300 pt-1">
                    <span>Grand Total:</span>
                    <span>{formatPrice(selectedOrderForJobSheet.total || 0, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL 3: EDIT COURIER & LOGISTICS DETAILS
      ---------------------------------------------------- */}
      {editingOrderCourier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md border border-stone-300 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-serif font-bold text-sm text-stone-950 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37]" /> Edit Shipping & Courier (#{editingOrderCourier.orderId})
              </h3>
              <button onClick={() => setEditingOrderCourier(null)}>
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-stone-600 block mb-1">Courier Partner</label>
                <select
                  value={courierNameInput}
                  onChange={e => setCourierNameInput(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                >
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="Delhivery Surface & Air">Delhivery Surface & Air</option>
                  <option value="DHL Express Luxury">DHL Express Luxury</option>
                  <option value="FedEx Priority">FedEx Priority</option>
                  <option value="Boutique White-Glove Valet">Boutique White-Glove Valet</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-600 block mb-1">Tracking / AWB Number</label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={e => setTrackingNumberInput(e.target.value)}
                  placeholder="e.g. BLUEDART-88992211"
                  className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-600 block mb-1">Estimated Delivery Date</label>
                <input
                  type="text"
                  value={estimatedDeliveryInput}
                  onChange={e => setEstimatedDeliveryInput(e.target.value)}
                  placeholder="e.g. Sep 02, 2026"
                  className="w-full p-2 bg-[#FAF8F5] border border-stone-300 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => setEditingOrderCourier(null)}
                className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourierDetails}
                className="px-4 py-1.5 bg-stone-950 text-[#D4AF37] text-xs font-mono font-bold"
              >
                Save Logistics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Slip Viewer Modal */}
      {viewingSlipPrescription && viewingSlipPrescription.prescriptionFileUrl && (
        <DoctorSlipViewerModal
          isOpen={!!viewingSlipPrescription}
          onClose={() => setViewingSlipPrescription(null)}
          fileUrl={viewingSlipPrescription.prescriptionFileUrl}
          fileName={viewingSlipPrescription.prescriptionFileName || 'Doctor_Prescription_Slip'}
          fileType={viewingSlipPrescription.prescriptionFileType}
          doctorName={viewingSlipPrescription.doctorName}
          clinicName={viewingSlipPrescription.clinicName}
          date={viewingSlipPrescription.date}
        />
      )}
    </div>
  );
};
