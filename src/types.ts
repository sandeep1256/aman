export type CategoryType = 
  | 'all'
  | 'spectacles' 
  | 'sunglasses' 
  | 'blue_light'
  | 'computer_bluecut' 
  | 'progressive'
  | 'reading' 
  | 'kids' 
  | 'sports';

export type ProductCategory = CategoryType;

export type GenderType = 'all' | 'men' | 'women' | 'unisex' | 'kids';

export type FrameShape = 
  | 'Aviator' 
  | 'Wayfarer' 
  | 'Round' 
  | 'Square'
  | 'Cat-Eye' 
  | 'Hexagonal' 
  | 'Browline' 
  | 'Rectangle' 
  | 'Oval';

export type FrameMaterial = 
  | 'Titanium' 
  | 'Italian Acetate' 
  | 'TR-90 Flexible' 
  | 'Stainless Steel' 
  | 'Eco Wood/Bio-Acetate';

export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Oblong';

export interface ProductColor {
  name: string;
  hex: string;
  frameImg: string;
  overlaySvgType: 'aviator' | 'round' | 'wayfarer' | 'cateye' | 'hexagonal' | 'browline' | 'rectangle';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'spectacles' | 'sunglasses' | 'computer_bluecut' | 'reading' | 'kids' | 'sports';
  gender: 'men' | 'women' | 'unisex' | 'kids';
  price: number; // In INR baseline
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  frameShape: FrameShape;
  frameMaterial: FrameMaterial;
  frameType: 'Full Rim' | 'Half Rim' | 'Rimless';
  weightGrams: number;
  size: 'Narrow' | 'Medium' | 'Wide';
  dimensions: {
    lensWidth: number;
    bridgeWidth: number;
    templeLength: number;
  };
  colors: ProductColor[];
  images: string[];
  description: string;
  features: string[];
  bestForFaceShapes: FaceShape[];
  inStock: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  tag?: string;
}

export interface LensOption {
  id: string;
  name: string;
  category: 'zero_power' | 'single_vision' | 'progressive_bifocal' | 'polarized_sun' | 'photochromic';
  index: '1.56 Standard' | '1.60 Thin' | '1.67 Ultra-Thin' | '1.74 Featherweight';
  price: number;
  description: string;
  coatings: string[];
  warrantyYears: number;
  idealFor: string;
}

export interface EyePower {
  sph: string;
  cyl: string;
  axis: string;
  add?: string;
}

export interface Prescription {
  type: 'zero_power' | 'single_vision' | 'bifocal_progressive' | 'reading';
  rightEye: EyePower;
  leftEye: EyePower;
  pd: number; // Pupillary distance in mm (default 62)
  prescriptionFileUrl?: string;
  prescriptionFileName?: string;
  prescriptionFileType?: 'image' | 'pdf';
  prescriptionFileSize?: string;
  doctorName?: string;
  clinicName?: string;
  savedName?: string;
  date?: string;
  notes?: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedColor: ProductColor;
  lensOption: LensOption;
  prescription?: Prescription;
  quantity: number;
  unitPrice: number;
}

export interface ShippingAddress {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: 'home' | 'office' | 'other';
  isDefault?: boolean;
}

export type PaymentMethodType = 'upi' | 'card' | 'wallet' | 'netbanking' | 'cod';

export interface OrderTimelineStep {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderPaymentDetails {
  transactionId: string;
  methodTitle: string;
  upiId?: string;
  payerUpiId?: string;
  utrNumber?: string;
  paymentProofUrl?: string;
  paymentProofName?: string;
  paymentDoneDeclared?: boolean;
  paymentVerifiedAt?: string;
  verifiedBy?: string;
  cardLast4?: string;
}

export interface Order {
  orderId: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentDetails: OrderPaymentDetails;
  prescriptionStatus?: 'not_required' | 'pending_verification' | 'verified' | 'clarification_needed';
  prescriptionNotes?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: Currency;
  status: 'confirmed' | 'lens_crafting' | 'precision_fitting' | 'quality_check' | 'dispatched' | 'out_for_delivery' | 'delivered';
  timeline: OrderTimelineStep[];
  trackingNumber: string;
  courierPartner: string;
  estimatedDelivery: string;
}

export interface TryOnSnapshot {
  id: string;
  timestamp: string;
  image: string;
  productName: string;
  productId: string;
  colorName: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'promo' | 'order' | 'health' | 'info';
  timestamp: string;
  read: boolean;
  link?: string;
}

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // 1 INR = rate
  name: string;
}

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ar' | 'bn';

export interface StylistQuizAnswers {
  faceShape?: FaceShape;
  gender?: string;
  lifestyle?: 'computer_work' | 'outdoor_sports' | 'fashion_daily' | 'reading_driving';
  framePreference?: 'minimal_light' | 'bold_statement' | 'classic_vintage' | 'colorful_modern';
  lensNeeds?: string;
}

export type AppTab = 'home' | 'catalog' | 'tryon' | 'stylist' | 'account' | 'cart' | 'admin' | 'contact';

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  membershipTier: 'Silver' | 'Gold' | 'Platinum' | 'Atelier Club';
  rewardPoints: number;
  role: 'customer' | 'admin';
  createdAt?: string;
  isAnonymous?: boolean;
}

export interface CategoryInfo {
  id: string;
  slug: CategoryType;
  name: string;
  description: string;
  tagline: string;
  image: string;
  itemCount?: number;
  highlightShapes: FrameShape[];
}

export interface GmbReview {
  id: string;
  author: string;
  authorPhotoUrl?: string;
  rating: number;
  date: string;
  comment: string;
  source: string;
  verified: boolean;
  userLocation?: string;
  likes?: number;
  createdAt?: string;
  ownerReply?: {
    date: string;
    comment: string;
  };
}

export interface GmbProfileData {
  businessName: string;
  tagline: string;
  category: string;
  rating: number;
  totalReviews: number;
  isOpenNow: boolean;
  timingText: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  formattedPhone: string;
  shareUrl: string;
  mapsSearchUrl: string;
  latitude: number;
  longitude: number;
  highlights: string[];
}

