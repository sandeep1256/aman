import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Wallet, 
  Building2, 
  Truck, 
  Tag, 
  Check, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { PaymentMethodType, Order, ShippingAddress } from '../../types';
import { formatPrice } from '../../data/currencies';

export const CheckoutModal: React.FC = () => {
  const { 
    checkoutModalOpen, 
    setCheckoutModalOpen, 
    cart, 
    cartSubtotal, 
    placeOrder, 
    currency, 
    t 
  } = useApp();

  const [step, setStep] = useState<'address' | 'payment' | 'otp_verify' | 'success'>('address');

  // Shipping Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Humanshu Sharma',
    phone: '+91 98765 43210',
    email: 'humanshu.nama@gmail.com',
    street: '742 Optical Avenue, Luxury Skyline Towers, Apt 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
    type: 'home'
  });

  // Promo Code State
  const [promoCode, setPromoCode] = useState('AMANOPTICS');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');

  // Specific Payment details
  const [upiId, setUpiId] = useState('humanshu@okaxis');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('gpay');
  const [qrTimeLeft, setQrTimeLeft] = useState(599); // 10 min

  // Card state
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 7890');
  const [cardHolder, setCardHolder] = useState('HUMANSHU SHARMA');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'rupay' | 'amex'>('visa');

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState<'apple_pay' | 'google_pay' | 'paypal' | 'paytm_wallet'>('google_pay');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // 3D Secure OTP verification simulation
  const [bankOtp, setBankOtp] = useState('849210');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Apply default promo code on load
  useEffect(() => {
    if (promoCode === 'AMANOPTICS') {
      const discountVal = Math.round(cartSubtotal * 0.40);
      setAppliedDiscount(discountVal);
      setPromoSuccess('AMANOPTICS applied (40% OFF Luxury Eyewear Promo)');
    }
  }, [cartSubtotal]);

  // QR Timer Countdown
  useEffect(() => {
    if (paymentMethod === 'upi' && qrTimeLeft > 0) {
      const timer = setInterval(() => setQrTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [paymentMethod, qrTimeLeft]);

  if (!checkoutModalOpen) return null;

  const handleApplyPromo = () => {
    setPromoError(null);
    setPromoSuccess(null);
    const code = promoCode.trim().toUpperCase();

    if (code === 'AMANOPTICS') {
      const discountVal = Math.round(cartSubtotal * 0.40);
      setAppliedDiscount(discountVal);
      setPromoSuccess('40% OFF applied with AMANOPTICS!');
    } else if (code === 'FIRSTBUY') {
      const discountVal = Math.min(cartSubtotal, 500);
      setAppliedDiscount(discountVal);
      setPromoSuccess('₹500 Welcome Discount applied!');
    } else if (code === 'EYECARE20') {
      const discountVal = Math.round(cartSubtotal * 0.20);
      setAppliedDiscount(discountVal);
      setPromoSuccess('20% Vision Health Discount applied!');
    } else {
      setPromoError('Invalid coupon code. Try AMANOPTICS for 40% OFF.');
    }
  };

  const shippingFee = 0; // Free express delivery
  const tax = Math.round((cartSubtotal - appliedDiscount) * 0.05); // 5% optical GST/tax
  const grandTotal = Math.max(0, cartSubtotal - appliedDiscount + shippingFee + tax);

  // Handle Card input formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted.substring(0, 19));

    if (raw.startsWith('4')) setCardBrand('visa');
    else if (raw.startsWith('5')) setCardBrand('mastercard');
    else if (raw.startsWith('6')) setCardBrand('rupay');
    else if (raw.startsWith('3')) setCardBrand('amex');
  };

  // Trigger Payment Completion
  const executePayment = () => {
    if (paymentMethod === 'card') {
      setStep('otp_verify');
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      completeOrderPlacement();
    }, 1500);
  };

  const handleVerifyBankOtp = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      completeOrderPlacement();
    }, 1200);
  };

  const completeOrderPlacement = () => {
    const newOrderId = `AO-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      orderId: newOrderId,
      date: new Date().toISOString(),
      items: cart,
      shippingAddress: address,
      paymentMethod,
      paymentStatus: 'paid',
      paymentDetails: {
        transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        methodTitle: paymentMethod === 'upi' ? `Instant UPI (${selectedUpiApp.toUpperCase()})` :
                     paymentMethod === 'card' ? `${cardBrand.toUpperCase()} Card (ending in ${cardNumber.slice(-4)})` :
                     paymentMethod === 'wallet' ? `Digital Wallet (${selectedWallet})` :
                     paymentMethod === 'netbanking' ? `Net Banking (${selectedBank})` : 'Cash on Delivery',
        upiId: paymentMethod === 'upi' ? upiId : undefined,
        cardLast4: paymentMethod === 'card' ? cardNumber.slice(-4) : undefined
      },
      subtotal: cartSubtotal,
      discount: appliedDiscount,
      shipping: shippingFee,
      tax,
      total: grandTotal,
      currency,
      status: 'confirmed',
      timeline: [
        {
          status: 'confirmed',
          title: 'Order Confirmed & Payment Verified',
          description: 'Prescription passed to precision optical fitting lab',
          timestamp: 'Just now',
          completed: true
        },
        {
          status: 'lens_crafting',
          title: 'Digital High-Definition Lens Surfacing',
          description: 'Anti-reflective & scratch-shield coating application',
          timestamp: 'Scheduled Today',
          completed: false
        },
        {
          status: 'precision_fitting',
          title: 'Laser Frame Fitting & Centration',
          description: 'Calibrating to exact pupillary distance (PD)',
          timestamp: 'Scheduled Tomorrow',
          completed: false
        },
        {
          status: 'quality_check',
          title: 'Quality Pass & Zero-Scratch Certification',
          description: '1-Year Warranty Booklet generated',
          timestamp: 'Scheduled in 2 Days',
          completed: false
        },
        {
          status: 'dispatched',
          title: 'Dispatched via Air Courier Express',
          description: 'Dispatched in shock-proof velvet hardcase',
          timestamp: 'Scheduled in 3 Days',
          completed: false
        },
        {
          status: 'delivered',
          title: 'Doorstep Delivery',
          description: 'Contactless delivery with signature confirmation',
          timestamp: 'Estimated in 3-4 Days',
          completed: false
        }
      ],
      trackingNumber: `AMAN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      courierPartner: 'BlueDart Air Express',
      estimatedDelivery: '3-4 Business Days'
    };

    setIsProcessingPayment(false);
    setCreatedOrder(newOrder);
    placeOrder(newOrder);
    setStep('success');

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in select-none">
      <div 
        id="checkout-modal-container"
        className="bg-white border border-stone-300 max-w-xl w-full my-auto shadow-2xl text-stone-900 overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button
                onClick={() => setStep('address')}
                className="p-1.5 bg-white border border-stone-300 text-stone-700 hover:text-stone-950 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="text-[10px] text-stone-500 font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-950 leading-tight">
                {step === 'address' && '1. Shipping & Recipient Details'}
                {step === 'payment' && '2. Secure Payment Gateway'}
                {step === 'otp_verify' && '3. 3D-Secure Bank Authentication'}
                {step === 'success' && 'Order Successfully Placed'}
              </h3>
            </div>
          </div>

          {step !== 'success' && (
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="p-2 bg-white border border-stone-300 text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: SHIPPING ADDRESS */}
        {step === 'address' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
            {/* Promo Code Input Card */}
            <div className="p-4 bg-[#FAF8F5] border border-stone-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-900 uppercase">
                <Tag className="w-4 h-4 text-[#D4AF37]" />
                <span>Have a Privilege Coupon?</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AMANOPTICS"
                  className="flex-1 bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 uppercase font-mono tracking-wider focus:outline-none focus:border-stone-900"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white font-mono uppercase font-bold text-xs cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && (
                <div className="text-[11px] text-stone-800 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{promoSuccess}</span>
                </div>
              )}
              {promoError && (
                <div className="text-[11px] text-rose-600 font-mono">
                  {promoError}
                </div>
              )}
            </div>

            {/* Address Form */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                Recipient & Delivery Address:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-stone-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-stone-600 block mb-1">Phone (for dispatch SMS/OTP)</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-600 block mb-1">Street Address / Suite</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-mono text-stone-600 block mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-stone-600 block mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-stone-600 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown Preview */}
            <div className="p-4 bg-[#FAF8F5] border border-stone-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({cart.length} item{cart.length > 1 ? 's' : ''}):</span>
                <span>{formatPrice(cartSubtotal, currency)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-stone-900 font-bold">
                  <span>Privilege Discount:</span>
                  <span>-{formatPrice(appliedDiscount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Express Insured Courier:</span>
                <span className="text-stone-900 font-bold">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Optical Verification & Tax:</span>
                <span>{formatPrice(tax, currency)}</span>
              </div>
              <div className="pt-2.5 border-t border-stone-300 flex justify-between text-sm font-bold text-stone-950">
                <span>Total Payable:</span>
                <span className="text-base text-stone-950">{formatPrice(grandTotal, currency)}</span>
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={() => setStep('payment')}
              className="w-full py-4 bg-stone-950 text-white font-mono uppercase font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 shadow-xs cursor-pointer"
            >
              <span>Proceed to Payment</span>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        )}

        {/* STEP 2: PAYMENT METHOD GATEWAY SELECTION */}
        {step === 'payment' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'card', label: 'Cards', icon: CreditCard },
                { id: 'wallet', label: 'Wallets', icon: Wallet },
                { id: 'netbanking', label: 'NetBanking', icon: Building2 },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as PaymentMethodType)}
                    className={`p-3 border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-950 border-stone-950 text-white font-bold'
                        : 'bg-[#FAF8F5] border-stone-300 text-stone-700 hover:text-stone-950'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase font-bold">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 1. UPI METHOD CONTENT */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 bg-[#FAF8F5] p-5 border border-stone-200">
                <div className="flex items-center justify-between text-xs border-b border-stone-200 pb-2.5">
                  <span className="font-serif font-bold text-stone-950 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                    <span>Instant UPI Payment</span>
                  </span>
                  <span className="text-stone-600 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Expires in {Math.floor(qrTimeLeft / 60)}:{(qrTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                {/* UPI Apps selector */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { id: 'gpay', name: 'Google Pay' },
                    { id: 'phonepe', name: 'PhonePe' },
                    { id: 'paytm', name: 'Paytm' },
                    { id: 'cred', name: 'CRED' }
                  ].map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedUpiApp(app.id as any)}
                      className={`p-2.5 border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        selectedUpiApp === app.id
                          ? 'bg-stone-950 border-stone-950 text-white'
                          : 'bg-white border-stone-300 text-stone-700 hover:text-stone-950'
                      }`}
                    >
                      <div className="text-[10px] font-bold">{app.name}</div>
                    </button>
                  ))}
                </div>

                {/* QR Code generator preview */}
                <div className="flex flex-col items-center justify-center p-5 bg-white border border-stone-300 max-w-[220px] mx-auto text-stone-900">
                  <div className="w-36 h-36 bg-stone-950 p-2 flex items-center justify-center relative">
                    <div className="w-full h-full bg-white p-1.5 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-8 h-8 bg-stone-950" />
                        <div className="w-8 h-8 bg-stone-950" />
                      </div>
                      <div className="text-[8px] font-mono text-center font-black tracking-widest text-stone-950 uppercase">
                        AMAN OPTICLES
                      </div>
                      <div className="flex justify-between">
                        <div className="w-8 h-8 bg-stone-950" />
                        <div className="w-3 h-3 bg-[#D4AF37] mx-auto self-center" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold mt-2.5 text-stone-900">
                    Scan with UPI App
                  </span>
                  <span className="text-[11px] text-stone-600 font-mono font-bold">
                    {formatPrice(grandTotal, currency)}
                  </span>
                </div>

                {/* UPI ID input */}
                <div>
                  <label className="text-[11px] font-mono text-stone-600 block mb-1">Or enter VPA / UPI Handle</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>
            )}

            {/* 2. CARD METHOD CONTENT */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                {/* Visual Card Representation */}
                <div className="p-5 bg-stone-950 border border-stone-800 text-white space-y-3 relative overflow-hidden shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">
                      Aman Opticles Privilege Card
                    </span>
                    <span className="text-xs font-mono font-bold uppercase text-white bg-stone-800 px-2 py-0.5 border border-stone-700">
                      {cardBrand}
                    </span>
                  </div>

                  <div className="text-base sm:text-lg font-mono tracking-widest text-stone-100 pt-2">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex justify-between items-end text-xs text-stone-300 font-mono">
                    <div>
                      <div className="text-[9px] text-stone-400 uppercase">Cardholder</div>
                      <div className="font-semibold uppercase truncate max-w-[160px]">{cardHolder || 'FULL NAME'}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-stone-400 uppercase">Expires</div>
                      <div className="font-semibold">{cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="space-y-3 bg-[#FAF8F5] p-5 border border-stone-200 text-xs font-mono">
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4532 8912 3456 7890"
                      className="w-full bg-white border border-stone-300 p-2.5 text-stone-900 font-mono focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-stone-300 p-2.5 text-stone-900 uppercase focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-600 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-white border border-stone-300 p-2.5 text-stone-900 font-mono focus:outline-none focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-600 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full bg-white border border-stone-300 p-2.5 text-stone-900 font-mono focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. DIGITAL WALLETS CONTENT */}
            {paymentMethod === 'wallet' && (
              <div className="space-y-3 bg-[#FAF8F5] p-5 border border-stone-200">
                <label className="text-xs font-mono font-bold text-stone-900 uppercase block mb-1">Select Digital Wallet:</label>
                <div className="space-y-2">
                  {[
                    { id: 'apple_pay', name: 'Apple Pay (Touch / Face ID)', desc: 'Instant biometric token payment' },
                    { id: 'google_pay', name: 'Google Wallet / GPay', desc: 'Secure saved token balance' },
                    { id: 'paypal', name: 'PayPal Global Express', desc: 'Buyer Protection Guarantee' },
                    { id: 'paytm_wallet', name: 'Paytm Wallet', desc: 'Instant wallet debit' }
                  ].map((w) => (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWallet(w.id as any)}
                      className={`p-3.5 border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedWallet === w.id
                          ? 'bg-stone-950 border-stone-950 text-white'
                          : 'bg-white border-stone-300 text-stone-800 hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold font-serif">{w.name}</div>
                        <div className="text-[10px] text-stone-500 font-mono">{w.desc}</div>
                      </div>
                      <div className={`w-4 h-4 border flex items-center justify-center ${
                        selectedWallet === w.id ? 'border-[#D4AF37] bg-[#D4AF37] text-stone-950' : 'border-stone-400'
                      }`}>
                        {selectedWallet === w.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. NET BANKING CONTENT */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-3 bg-[#FAF8F5] p-5 border border-stone-200">
                <label className="text-xs font-mono font-bold text-stone-900 uppercase block mb-1">Select Bank Gateway:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'HDFC Bank',
                    'ICICI Bank',
                    'State Bank of India',
                    'Axis Bank',
                    'Kotak Mahindra',
                    'Citibank / International'
                  ].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 border text-xs font-mono font-bold uppercase text-left transition-all cursor-pointer ${
                        selectedBank === bank
                          ? 'bg-stone-950 border-stone-950 text-white'
                          : 'bg-white border-stone-300 text-stone-700 hover:text-stone-950'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pay Action Button */}
            <button
              onClick={executePayment}
              disabled={isProcessingPayment}
              className="w-full py-4 bg-stone-950 text-white font-mono uppercase font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Secure Transaction...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Pay {formatPrice(grandTotal, currency)}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: 3D-SECURE BANK OTP VERIFICATION MODAL */}
        {step === 'otp_verify' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 text-center">
            <div className="w-14 h-14 bg-[#FAF8F5] border border-stone-300 text-stone-950 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-stone-950">3D Secure Bank Verification</h3>
              <p className="text-xs text-stone-600 font-mono mt-1">
                A 6-digit OTP has been dispatched to your registered phone ending in <strong>4321</strong>.
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-stone-200 max-w-xs mx-auto space-y-3">
              <div className="text-xs text-stone-500 font-mono">Merchant: Aman Opticles Studio</div>
              <div className="text-base font-bold font-mono text-stone-950">{formatPrice(grandTotal, currency)}</div>

              <input
                type="text"
                value={bankOtp}
                onChange={(e) => setBankOtp(e.target.value)}
                maxLength={6}
                className="w-full bg-white border border-stone-950 p-3 text-center text-xl font-mono tracking-widest text-stone-950 focus:outline-none"
              />

              <div className="text-[10px] text-stone-600 font-mono uppercase font-bold">
                Auto-Filled Sandbox OTP: 849210
              </div>
            </div>

            <button
              onClick={handleVerifyBankOtp}
              disabled={isProcessingPayment}
              className="w-full max-w-xs mx-auto py-3.5 bg-stone-950 text-white font-mono uppercase font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 transition-all cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Gateway...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>Submit OTP & Place Order</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 4: ORDER SUCCESS */}
        {step === 'success' && createdOrder && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#FAF8F5] border border-stone-300 text-stone-950 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#D4AF37]" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-widest">
                Payment Authorized • Guaranteed Delivery
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 mt-1">
                Thank You for Choosing Aman Opticles
              </h2>
              <p className="text-xs text-stone-600 font-mono mt-1">
                Order <strong className="text-stone-950 font-bold">#{createdOrder.orderId}</strong> is sent to our precision edging lab.
              </p>
            </div>

            {/* Order Brief Summary */}
            <div className="p-4 bg-[#FAF8F5] border border-stone-200 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Estimated Delivery:</span>
                <span className="font-bold text-stone-950">{createdOrder.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Payment Channel:</span>
                <span className="text-stone-950 font-bold">{createdOrder.paymentDetails.methodTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Warranty:</span>
                <span className="text-stone-950 font-bold">1-Year Certificate Included</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setCheckoutModalOpen(false);
                }}
                className="w-full py-4 bg-stone-950 text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer shadow-xs"
              >
                Track Live Order in Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
