import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Search, 
  Package, 
  Zap, 
  Sparkles, 
  Compass, 
  ArrowUpRight,
  Plane,
  Building2,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DeliveryHub {
  id: string;
  name: string;
  state: string;
  region: 'north' | 'west' | 'south' | 'east' | 'central';
  x: number; // SVG coordinates
  y: number;
  curveX: number; // Bézier control point X
  curveY: number; // Bézier control point Y
  tat: string; // Turn Around Time
  courier: string;
  status: 'Express Active' | 'Priority Flight' | 'Local Same-Day';
}

// Origin: Sawai Madhopur, Rajasthan
const ORIGIN_HUB = {
  name: 'Aman Opticals Central Atelier',
  city: 'Sawai Madhopur',
  state: 'Rajasthan',
  pincode: '322201',
  x: 200,
  y: 252,
  lat: '26.0124° N',
  lng: '76.3533° E'
};

const DELIVERY_HUBS: DeliveryHub[] = [
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'north',
    x: 185,
    y: 232,
    curveX: 190,
    curveY: 240,
    tat: 'Same Day / 24h',
    courier: 'Aman Express / Bluedart',
    status: 'Local Same-Day'
  },
  {
    id: 'delhi',
    name: 'New Delhi & NCR',
    state: 'Delhi NCR',
    region: 'north',
    x: 220,
    y: 195,
    curveX: 205,
    curveY: 220,
    tat: '24 - 48 Hours',
    courier: 'Bluedart Air Express',
    status: 'Priority Flight'
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh / Punjab',
    state: 'Punjab & Haryana',
    region: 'north',
    x: 198,
    y: 155,
    curveX: 185,
    curveY: 200,
    tat: '48 Hours',
    courier: 'Delhivery Express',
    status: 'Express Active'
  },
  {
    id: 'srinagar',
    name: 'Srinagar / Kashmir',
    state: 'J&K',
    region: 'north',
    x: 180,
    y: 95,
    curveX: 170,
    curveY: 170,
    tat: '3 - 4 Days',
    courier: 'Speed Post / Air',
    status: 'Priority Flight'
  },
  {
    id: 'mumbai',
    name: 'Mumbai / Pune',
    state: 'Maharashtra',
    region: 'west',
    x: 148,
    y: 410,
    curveX: 160,
    curveY: 330,
    tat: '48 Hours Air',
    courier: 'Bluedart Priority',
    status: 'Priority Flight'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad / Surat',
    state: 'Gujarat',
    region: 'west',
    x: 135,
    y: 320,
    curveX: 155,
    curveY: 280,
    tat: '36 - 48 Hours',
    courier: 'Delhivery Direct',
    status: 'Express Active'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru / Tech Corridor',
    state: 'Karnataka',
    region: 'south',
    x: 215,
    y: 530,
    curveX: 190,
    curveY: 390,
    tat: '2 - 3 Days',
    courier: 'Bluedart Aviation',
    status: 'Priority Flight'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad / Secunderabad',
    state: 'Telangana',
    region: 'south',
    x: 238,
    y: 435,
    curveX: 210,
    curveY: 340,
    tat: '48 - 72 Hours',
    courier: 'Delhivery Air',
    status: 'Express Active'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    region: 'south',
    x: 260,
    y: 525,
    curveX: 245,
    curveY: 390,
    tat: '3 Days',
    courier: 'Bluedart Express',
    status: 'Priority Flight'
  },
  {
    id: 'kochi',
    name: 'Kochi / Trivandrum',
    state: 'Kerala',
    region: 'south',
    x: 195,
    y: 600,
    curveX: 180,
    curveY: 420,
    tat: '3 - 4 Days',
    courier: 'Air Cargo Express',
    status: 'Express Active'
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    region: 'east',
    x: 385,
    y: 340,
    curveX: 300,
    curveY: 280,
    tat: '2 - 3 Days',
    courier: 'Bluedart Priority',
    status: 'Priority Flight'
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    region: 'east',
    x: 345,
    y: 265,
    curveX: 275,
    curveY: 250,
    tat: '48 - 72 Hours',
    courier: 'Speed Post / Bluedart',
    status: 'Express Active'
  },
  {
    id: 'lucknow',
    name: 'Lucknow / Kanpur',
    state: 'Uttar Pradesh',
    region: 'central',
    x: 280,
    y: 240,
    curveX: 240,
    curveY: 240,
    tat: '36 - 48 Hours',
    courier: 'Delhivery Surface/Air',
    status: 'Express Active'
  },
  {
    id: 'guwahati',
    name: 'Guwahati / North-East',
    state: 'Assam & 7 Sisters',
    region: 'east',
    x: 475,
    y: 265,
    curveX: 340,
    curveY: 230,
    tat: '3 - 5 Days Air',
    courier: 'Bluedart Air Wing',
    status: 'Priority Flight'
  }
];

// Sample live dispatched queue for real-time vibe
const LIVE_DISPATCHES = [
  { order: 'AO-7412', item: 'Kobe Hexagonal Titanium', to: 'Connaught Place, New Delhi', status: 'In Transit' },
  { order: 'AO-7413', item: 'Sorrento Polarized Sun', to: 'Bandra West, Mumbai', status: 'Out for Delivery' },
  { order: 'AO-7414', item: 'Blue-Shield 420nm Flex', to: 'Koramangala, Bengaluru', status: 'Dispatched via Air' },
  { order: 'AO-7415', item: 'Venice Rimless Spectacles', to: 'C-Scheme, Jaipur', status: 'Delivered (Same Day)' }
];

export const PanIndiaDeliveryMap: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'north' | 'west' | 'south' | 'east' | 'central'>('all');
  const [hoveredHub, setHoveredHub] = useState<DeliveryHub | null>(null);
  
  // Pincode lookup state
  const [pincodeQuery, setPincodeQuery] = useState<string>('');
  const [pincodeResult, setPincodeResult] = useState<{
    code: string;
    city: string;
    state: string;
    tat: string;
    status: 'express' | 'standard';
    courier: string;
    cost: string;
  } | null>(null);

  const activeHubs = useMemo(() => {
    if (selectedRegion === 'all') return DELIVERY_HUBS;
    return DELIVERY_HUBS.filter(h => h.region === selectedRegion);
  }, [selectedRegion]);

  const handlePincodeSearch = (codeToTest?: string) => {
    const raw = (codeToTest || pincodeQuery).trim();
    if (!raw || raw.length < 3) return;

    const firstDigit = raw[0];
    const firstTwo = raw.slice(0, 2);

    let city = 'Metro & Urban Hub';
    let state = 'India';
    let tat = '2 - 3 Business Days';
    let courier = 'Bluedart / Delhivery Air';

    if (raw.startsWith('322201')) {
      city = 'Sawai Madhopur (Home Atelier)';
      state = 'Rajasthan';
      tat = 'Same-Day / 3-6 Hours Store Pickup or Direct Courier';
      courier = 'Aman Opticals Direct Express';
    } else if (firstTwo === '30' || firstTwo === '31' || firstTwo === '32' || firstTwo === '33' || firstTwo === '34') {
      city = 'Jaipur / Jodhpur / Kota / Rajasthan';
      state = 'Rajasthan';
      tat = '24 - 36 Hours Priority';
      courier = 'Aman Intra-State Express';
    } else if (firstTwo === '11') {
      city = 'New Delhi';
      state = 'Delhi NCR';
      tat = '24 - 48 Hours';
      courier = 'Bluedart Apex Air';
    } else if (firstTwo === '12' || firstTwo === '20') {
      city = 'Gurugram / Noida / Ghaziabad';
      state = 'Delhi NCR';
      tat = '24 - 48 Hours';
      courier = 'Delhivery Next-Day';
    } else if (firstTwo === '40' || firstTwo === '41') {
      city = 'Mumbai / Pune / Thane';
      state = 'Maharashtra';
      tat = '48 Hours';
      courier = 'Bluedart Air Express';
    } else if (firstTwo === '56' || firstTwo === '57') {
      city = 'Bengaluru';
      state = 'Karnataka';
      tat = '2 - 3 Days';
      courier = 'Bluedart Air Aviation';
    } else if (firstTwo === '60') {
      city = 'Chennai';
      state = 'Tamil Nadu';
      tat = '2 - 3 Days';
      courier = 'Delhivery Air';
    } else if (firstTwo === '50') {
      city = 'Hyderabad';
      state = 'Telangana';
      tat = '2 - 3 Days';
      courier = 'Bluedart Air';
    } else if (firstTwo === '70') {
      city = 'Kolkata';
      state = 'West Bengal';
      tat = '2 - 3 Days';
      courier = 'Bluedart Express';
    } else if (firstTwo === '38' || firstTwo === '39') {
      city = 'Ahmedabad / Surat / Vadodara';
      state = 'Gujarat';
      tat = '36 - 48 Hours';
      courier = 'Bluedart / Delhivery';
    } else if (firstDigit === '7' || firstDigit === '8') {
      city = 'Eastern / North-Eastern India';
      state = 'East Region';
      tat = '3 - 5 Days Air';
      courier = 'India Post Speed Post / Bluedart Air';
    } else if (firstDigit === '1') {
      city = 'Northern India';
      state = 'North Zone';
      tat = '2 - 3 Days';
      courier = 'Bluedart / Delhivery';
    } else if (firstDigit === '4' || firstDigit === '3') {
      city = 'Western India';
      state = 'West Zone';
      tat = '2 - 3 Days';
      courier = 'Bluedart Priority';
    } else if (firstDigit === '5' || firstDigit === '6') {
      city = 'Southern India';
      state = 'South Zone';
      tat = '2 - 3 Days';
      courier = 'Bluedart Air';
    }

    setPincodeResult({
      code: raw,
      city,
      state,
      tat,
      status: 'express',
      courier,
      cost: 'FREE (All India Zero Shipping Cost)'
    });
  };

  return (
    <section className="bg-stone-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden border-t-2 border-[#D4AF37]">
      {/* Background Blueprint Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-stone-800 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
                PAN-INDIA OPTICAL LOGISTICS • LIVE NETWORK
              </span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
              Delivering Across India <br className="hidden sm:inline" />
              <span className="italic text-[#D4AF37]">19,000+ Pincodes Covered</span>
            </h2>

            <p className="text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Dispatched with white-glove care straight from our central lens surfacing lab in 
              <strong className="text-white"> Sawai Madhopur, Rajasthan</strong>. Every pair travels 100% transit-insured 
              in a rigid shock-proof luxury optical vault.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 bg-stone-900/80 border border-stone-800">
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Delivery Reach</div>
              <div className="font-serif text-lg font-bold text-white mt-0.5">All 28 States</div>
              <div className="text-[9px] text-stone-500 font-mono">+ 8 Union Territories</div>
            </div>
            <div className="p-3 bg-stone-900/80 border border-stone-800">
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Transit Safe</div>
              <div className="font-serif text-lg font-bold text-white mt-0.5">100% Insured</div>
              <div className="text-[9px] text-stone-500 font-mono">Zero Damage Risk</div>
            </div>
            <div className="p-3 bg-stone-900/80 border border-stone-800">
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Air Courier</div>
              <div className="font-serif text-lg font-bold text-white mt-0.5">24 - 48 Hrs</div>
              <div className="text-[9px] text-stone-500 font-mono">Delhi NCR & Metros</div>
            </div>
            <div className="p-3 bg-stone-900/80 border border-stone-800">
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Shipping Cost</div>
              <div className="font-serif text-lg font-bold text-white mt-0.5">Zero (FREE)</div>
              <div className="text-[9px] text-stone-500 font-mono">On All Orders</div>
            </div>
          </div>
        </div>

        {/* Interactive Zone Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold mr-2 hidden sm:inline">
              Filter Corridors:
            </span>
            {[
              { id: 'all', label: 'All India Network' },
              { id: 'north', label: 'North & NCR' },
              { id: 'west', label: 'West (MH & GJ)' },
              { id: 'south', label: 'South Metros' },
              { id: 'east', label: 'East & North-East' },
              { id: 'central', label: 'Central & UP' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedRegion === tab.id
                    ? 'bg-[#D4AF37] text-stone-950 border-[#D4AF37] font-bold shadow-md'
                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white hover:border-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-stone-400 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Active Dispatch Hub: <strong className="text-white">Sawai Madhopur Lab</strong></span>
          </div>
        </div>

        {/* Main Interactive Map & Dispatch Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Running Vector SVG Map of India */}
          <div className="lg:col-span-7 bg-stone-900/60 border border-stone-800 p-4 sm:p-6 relative shadow-2xl overflow-hidden rounded-sm">
            {/* Top map telemetry bar */}
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-3 mb-4 text-[10px] font-mono text-stone-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-emerald-400 font-bold">14 ACTIVE AIR & SURFACE CORRIDORS</span>
              </div>
              <div>COORDINATES: {ORIGIN_HUB.lat}, {ORIGIN_HUB.lng}</div>
            </div>

            {/* The SVG Container */}
            <div className="relative w-full aspect-[1/1.08] max-w-[540px] mx-auto select-none">
              <svg 
                viewBox="0 0 540 640" 
                className="w-full h-full filter drop-shadow-lg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle radial map gradient */}
                  <radialGradient id="indiaLandGradient" cx="45%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#242322" />
                    <stop offset="60%" stopColor="#1a1918" />
                    <stop offset="100%" stopColor="#121211" />
                  </radialGradient>

                  {/* Golden Vector Glow for Running Routes */}
                  <linearGradient id="routeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5D061" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
                  </linearGradient>

                  {/* Amber Beacon Pulse */}
                  <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Latitude & Longitude Aesthetic Grid */}
                <g stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="40" y1="120" x2="500" y2="120" />
                  <line x1="40" y1="240" x2="500" y2="240" />
                  <line x1="40" y1="360" x2="500" y2="360" />
                  <line x1="40" y1="480" x2="500" y2="480" />
                  <line x1="140" y1="40" x2="140" y2="600" />
                  <line x1="240" y1="40" x2="240" y2="600" />
                  <line x1="340" y1="40" x2="340" y2="600" />
                  <line x1="440" y1="40" x2="440" y2="600" />
                </g>

                {/* HIGH-FIDELITY VECTOR SILHOUETTE OF INDIA MAINLAND */}
                <path
                  d="
                    M 180 50
                    L 215 35
                    L 255 45
                    L 270 70
                    L 255 100
                    L 235 125
                    L 205 140
                    L 190 170
                    L 145 200
                    L 125 240
                    L 100 290
                    L 70 300
                    L 85 330
                    L 130 335
                    L 115 375
                    L 145 390
                    L 140 450
                    L 165 490
                    L 175 540
                    L 190 600
                    L 210 635
                    L 225 615
                    L 250 540
                    L 280 470
                    L 325 395
                    L 355 350
                    L 380 340
                    L 395 315
                    L 370 295
                    L 375 270
                    L 410 260
                    L 440 240
                    L 485 220
                    L 520 235
                    L 510 270
                    L 475 285
                    L 445 320
                    L 400 345
                    L 350 330
                    L 320 280
                    L 280 250
                    L 255 210
                    L 215 170
                    L 195 120
                    Z
                  "
                  fill="url(#indiaLandGradient)"
                  stroke="#44403c"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  className="transition-colors"
                />

                {/* Secondary Detail Contour: Island Territories */}
                {/* Andaman & Nicobar */}
                <g fill="#D4AF37" opacity="0.6">
                  <circle cx="470" cy="520" r="2" />
                  <circle cx="473" cy="535" r="2.5" />
                  <circle cx="475" cy="555" r="2" />
                  <circle cx="478" cy="575" r="1.5" />
                </g>
                {/* Lakshadweep */}
                <g fill="#D4AF37" opacity="0.6">
                  <circle cx="140" cy="550" r="1.5" />
                  <circle cx="143" cy="565" r="2" />
                  <circle cx="148" cy="580" r="1.5" />
                </g>

                {/* RUNNING VECTOR DELIVERY PATHS WITH CONTINUOUS ARCS */}
                {activeHubs.map((hub) => {
                  const isHovered = hoveredHub?.id === hub.id;
                  const pathD = `M ${ORIGIN_HUB.x} ${ORIGIN_HUB.y} Q ${hub.curveX} ${hub.curveY} ${hub.x} ${hub.y}`;

                  return (
                    <g key={`path-${hub.id}`}>
                      {/* Background Soft Track */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#ffffff"
                        strokeOpacity="0.08"
                        strokeWidth="1"
                      />

                      {/* RUNNING VECTOR PULSE: Animated Stroke with Dashoffset Flow */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isHovered ? '#FFFFFF' : 'url(#routeGoldGrad)'}
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                        className="transition-all"
                      >
                        {/* Native SVG running vector animation */}
                        <animate
                          attributeName="stroke-dashoffset"
                          from="100"
                          to="0"
                          dur={hub.region === 'north' ? '1.4s' : '2.0s'}
                          repeatCount="indefinite"
                        />
                      </path>

                      {/* RUNNING VECTOR COURIER PARTICLE traveling along path */}
                      <circle r={isHovered ? 3.5 : 2.5} fill={isHovered ? '#FFFFFF' : '#F5D061'}>
                        <animateMotion
                          path={pathD}
                          dur={hub.region === 'north' ? '1.8s' : '2.4s'}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}

                {/* DESTINATION HUBS (City Markers) */}
                {activeHubs.map((hub) => {
                  const isHovered = hoveredHub?.id === hub.id;

                  return (
                    <g
                      key={`hub-${hub.id}`}
                      onMouseEnter={() => setHoveredHub(hub)}
                      onMouseLeave={() => setHoveredHub(null)}
                      className="cursor-pointer group"
                    >
                      {/* Target Hub Ping Ring */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isHovered ? 8 : 4}
                        fill="#D4AF37"
                        fillOpacity={isHovered ? 0.3 : 0.15}
                        stroke="#D4AF37"
                        strokeWidth={1}
                      />

                      {/* City Center Dot */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isHovered ? 3.5 : 2.5}
                        fill={isHovered ? '#FFFFFF' : '#D4AF37'}
                        stroke="#000000"
                        strokeWidth={1}
                      />

                      {/* City Label */}
                      <text
                        x={hub.x + 6}
                        y={hub.y + 3}
                        fill={isHovered ? '#FFFFFF' : '#A8A29E'}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight={isHovered ? 'bold' : 'normal'}
                        className="select-none transition-colors"
                      >
                        {hub.name}
                      </text>
                    </g>
                  );
                })}

                {/* ============================================================ */}
                {/* CENTRAL ORIGIN HUB: SAWAI MADHOPUR ATELIER & LAB */}
                {/* ============================================================ */}
                <g>
                  {/* Expanding Radar Rings */}
                  <circle
                    cx={ORIGIN_HUB.x}
                    cy={ORIGIN_HUB.y}
                    r="14"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="6;26"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  <circle
                    cx={ORIGIN_HUB.x}
                    cy={ORIGIN_HUB.y}
                    r="8"
                    fill="#D4AF37"
                    fillOpacity="0.25"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                  />

                  {/* Core Pin */}
                  <circle
                    cx={ORIGIN_HUB.x}
                    cy={ORIGIN_HUB.y}
                    r="4"
                    fill="#F5D061"
                    stroke="#000000"
                    strokeWidth="1.2"
                    filter="url(#goldGlow)"
                  />

                  {/* Prominent Label Callout */}
                  <rect
                    x={ORIGIN_HUB.x - 70}
                    y={ORIGIN_HUB.y - 28}
                    width="140"
                    height="18"
                    fill="#18181B"
                    stroke="#D4AF37"
                    strokeWidth="1"
                    rx="2"
                  />
                  <text
                    x={ORIGIN_HUB.x}
                    y={ORIGIN_HUB.y - 16}
                    textAnchor="middle"
                    fill="#F5D061"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.5"
                  >
                    AMAN OPTICALS (ORIGIN)
                  </text>
                </g>
              </svg>

              {/* Floating Live Dispatch Pill */}
              <div className="absolute bottom-3 left-3 right-3 bg-stone-950/90 border border-stone-800 p-2.5 flex items-center justify-between text-xs backdrop-blur-xs">
                <div className="flex items-center gap-2 truncate">
                  <Package className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span className="text-[11px] font-mono text-stone-300 truncate">
                    Live Dispatch: <strong className="text-white">Connaught Place, New Delhi</strong> (In Transit via Bluedart)
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800 shrink-0 font-bold">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Hub Details Modal Bar (shown on hover) */}
            {hoveredHub && (
              <div className="mt-4 p-3 bg-stone-950 border border-[#D4AF37] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono transition-all">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase">Selected Corridor: </span>
                  <strong className="text-[#D4AF37] font-bold">{hoveredHub.name} ({hoveredHub.state})</strong>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-stone-300">
                  <span>TAT: <strong className="text-white">{hoveredHub.tat}</strong></span>
                  <span>Carrier: <strong className="text-white">{hoveredHub.courier}</strong></span>
                  <span className="px-2 py-0.5 bg-stone-900 border border-stone-700 text-emerald-400 text-[10px]">
                    {hoveredHub.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pincode Checker & Assurance Matrix */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Pincode Checker Card */}
            <div className="p-6 bg-stone-900/90 border border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-tight">
                  Check Delivery At Your Pincode
                </h3>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Enter your 6-digit Indian PIN code to view accurate air courier transit time and shipping privilege.
              </p>

              {/* Input & Search Form */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeQuery}
                    onChange={(e) => setPincodeQuery(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handlePincodeSearch()}
                    placeholder="e.g. 110001, 302001, 400001..."
                    className="w-full bg-stone-950 border border-stone-700 focus:border-[#D4AF37] text-white pl-9 pr-3 py-2.5 text-xs font-mono tracking-widest focus:outline-hidden"
                  />
                </div>
                <button
                  onClick={() => handlePincodeSearch()}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c59e2b] text-stone-950 font-bold text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </div>

              {/* Sample Quick Test Chips */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Quick Select City:</div>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {[
                    { label: '322201 (Sawai Madhopur)', pin: '322201' },
                    { label: '302001 (Jaipur)', pin: '302001' },
                    { label: '110001 (New Delhi)', pin: '110001' },
                    { label: '400001 (Mumbai)', pin: '400001' },
                    { label: '560001 (Bengaluru)', pin: '560001' },
                    { label: '700001 (Kolkata)', pin: '700001' }
                  ].map((item) => (
                    <button
                      key={item.pin}
                      onClick={() => {
                        setPincodeQuery(item.pin);
                        handlePincodeSearch(item.pin);
                      }}
                      className="px-2 py-1 bg-stone-950 border border-stone-800 hover:border-stone-600 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Result Box */}
              {pincodeResult && (
                <div className="p-4 bg-stone-950 border border-emerald-500/50 space-y-2 mt-4 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>DELIVERY ACTIVE TO {pincodeResult.code}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[9px] font-mono uppercase font-bold border border-emerald-800">
                      Express Flight
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-stone-300 font-mono pt-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Destination Region:</span>
                      <strong className="text-white">{pincodeResult.city}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Estimated Timeline:</span>
                      <strong className="text-[#D4AF37]">{pincodeResult.tat}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Assigned Carrier:</span>
                      <strong className="text-white">{pincodeResult.courier}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Courier Shipping Fee:</span>
                      <strong className="text-emerald-400 font-bold">{pincodeResult.cost}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4 Pillars of Aman Opticals Delivery */}
            <div className="space-y-3">
              <div className="p-3.5 bg-stone-900/60 border border-stone-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    100% Transit Loss & Damage Guarantee
                  </h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    If your optical frame or prescription lenses suffer any damage or scratch during courier transit, we replace it immediately free of charge.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-stone-900/60 border border-stone-800 flex items-start gap-3">
                <Package className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Protective Rigid Hard Case Included
                  </h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    Each order is boxed in our shock-absorbing magnetic rigid case with a microfiber optical lens cloth and warranty certificate.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-stone-900/60 border border-stone-800 flex items-start gap-3">
                <Plane className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    National Air Express Partnerships
                  </h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    Delivered via BlueDart Aviation, Delhivery Express, and India Post Speed Post with live SMS & WhatsApp tracking links.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Optical Workshop Contact Banner */}
            <div className="p-4 bg-gradient-to-r from-stone-900 to-stone-950 border border-stone-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Have a Special Pincode or Remote Area?</div>
                <div className="text-xs text-white">Call optical dispatch: <strong className="underline">097856 09194</strong></div>
              </div>
              <button
                onClick={() => setActiveTab('contact')}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white font-mono text-xs uppercase font-bold border border-stone-700 cursor-pointer flex items-center gap-1.5"
              >
                <span>Store Hub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>

          </div>

        </div>

        {/* Live Recent Dispatches Ticker Strip */}
        <div className="border-t border-stone-800/80 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-stone-400 uppercase tracking-widest text-[10px]">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Real-Time Dispatches from Sawai Madhopur Lab:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {LIVE_DISPATCHES.map((d, i) => (
                <div key={i} className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-[10px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-stone-300">{d.item}</span>
                  <span className="text-stone-500">→</span>
                  <span className="text-[#D4AF37]">{d.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
