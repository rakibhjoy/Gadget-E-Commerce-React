export const categories = [
  "All",
  "Smartphones",
  "Laptops",
  "Audio & Sound",
  "Smartwatches",
  "Gaming & Gear",
  "Accessories"
];

export const heroBanners = [
  {
    id: "banner-1",
    tag: "Official Launch 2026",
    title: "Joy Mart Tech Fest",
    subtitle: "Experience next-generation titanium phones, M3-class laptops & audiophile sound.",
    cta: "Explore Flash Deals",
    link: "/products?deal=true",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    badge: "Up to 25% OFF"
  },
  {
    id: "banner-2",
    tag: "Audiophile Collection",
    title: "Pure Sound. Zero Distortion.",
    subtitle: "Active noise-cancelling studio headphones with lossless beryllium acoustics.",
    cta: "Shop Audio Gear",
    link: "/products?category=Audio%20%26%20Sound",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    badge: "Official Warranty"
  }
];

export const products = [
  // --- Smartphones ---
  {
    id: "phone-zenith-1",
    name: "JoyPhone Pro Max Titanium",
    category: "Smartphones",
    price: 135000,
    originalPrice: 148000,
    badge: "Best Seller",
    rating: 4.9,
    reviewsCount: 240,
    isFeatured: true,
    isDeal: true,
    availability: "In Stock (Dhaka Hub)",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    description: "Aerospace-grade natural titanium frame with ultra-fluid 120Hz LTPO ProMotion display and next-generation A-Bionic neural processor.",
    specs: [
      "6.7\" Super Retina XDR OLED (120Hz Adaptive)",
      "Grade 5 Natural Titanium Enclosure",
      "48MP Quad-Pixel Pro Camera System",
      "All-day battery with 45W Ultra-Fast Charging"
    ]
  },
  {
    id: "phone-minimal-lite",
    name: "Joy Minimalist Phone 2",
    category: "Smartphones",
    price: 58000,
    originalPrice: 65000,
    badge: "New Arrival",
    rating: 4.7,
    reviewsCount: 92,
    isFeatured: false,
    isDeal: true,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    description: "Distraction-free pure OS with monochromatic glyph lighting, ceramic composite shell, and zero pre-installed bloatware.",
    specs: [
      "6.3\" 120Hz Flexible AMOLED Screen",
      "Interactive rear Glyph Interface",
      "50MP Sony IMX Dual Sensors",
      "4,700 mAh Battery with Wireless Qi Charging"
    ]
  },
  {
    id: "phone-fold-ultra",
    name: "Apex Horizon Fold V",
    category: "Smartphones",
    price: 185000,
    originalPrice: 199000,
    badge: "Flagship",
    rating: 4.9,
    reviewsCount: 64,
    isFeatured: true,
    isDeal: false,
    availability: "Only 2 left",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    description: "Creaseless dual-display folding architecture with armor aluminum hinge and immersive tablet productivity mode.",
    specs: [
      "7.8\" Foldable Dynamic AMOLED 2X",
      "Zero-gap water-drop precision hinge",
      "Integrated S-Pen stylus support",
      "IPX8 Water Resistance Rating"
    ]
  },

  // --- Laptops ---
  {
    id: "laptop-air-craft",
    name: "MacBlade Horizon 14 M3",
    category: "Laptops",
    price: 175000,
    originalPrice: 189000,
    badge: "Top Rated",
    rating: 5.0,
    reviewsCount: 148,
    isFeatured: true,
    isDeal: true,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    description: "Featherlight unibody CNC aluminum workstation with liquid retina display and silent fanless architecture for all-day coding.",
    specs: [
      "14.2\" Liquid Retina XDR (1,600 nits peak)",
      "12-Core Neural Silicon Architecture",
      "32GB Unified Ultra-Fast Memory",
      "Up to 22 Hours Continuous Battery Life"
    ]
  },
  {
    id: "laptop-studio-16",
    name: "Carbon Studio Book 16 Pro",
    category: "Laptops",
    price: 235000,
    originalPrice: 250000,
    badge: "Pro Workstation",
    rating: 4.8,
    reviewsCount: 77,
    isFeatured: false,
    isDeal: false,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    description: "Forged carbon fiber high-performance notebook with RTX studio graphics, color-accurate OLED screen, and dual vapor-chamber cooling.",
    specs: [
      "16\" 4K OLED Touch HDR 100% DCI-P3",
      "RTX 4080 12GB Dedicated GPU",
      "64GB DDR5 5600MHz Dual-Channel RAM",
      "2TB Gen4 PCIe NVMe SSD"
    ]
  },

  // --- Audio & Sound ---
  {
    id: "headphones-studio-anc",
    name: "JoySound Aura Pro ANC",
    category: "Audio & Sound",
    price: 34500,
    originalPrice: 39000,
    badge: "Best Seller",
    rating: 4.9,
    reviewsCount: 312,
    isFeatured: true,
    isDeal: true,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Lossless beryllium acoustic drivers with adaptive hybrid noise cancelling, memory foam ear cups, and multi-device connection.",
    specs: [
      "40mm High-Resolution Beryllium Drivers",
      "Adaptive ANC (Up to 42dB noise cancellation)",
      "50 Hours battery life with Quick Charge",
      "Spatial Audio with Dynamic Head Tracking"
    ]
  },
  {
    id: "earbuds-sonic-pods",
    name: "Pulse Pods ANC Wireless",
    category: "Audio & Sound",
    price: 15500,
    originalPrice: 18000,
    badge: "Trending",
    rating: 4.6,
    reviewsCount: 185,
    isFeatured: false,
    isDeal: true,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    description: "Compact IPX5 water-resistant earbuds with punchy bass, crystal-clear 6-mic phone calls, and wireless Qi charging case.",
    specs: [
      "Active Noise Cancellation with Transparency Mode",
      "6-Mic Environmental Noise Reduction (ENC)",
      "32 Hours Total Playback with Case",
      "Fast Pairing with iOS and Android"
    ]
  },
  {
    id: "speaker-studio-boom",
    name: "VibeStone Portable Hi-Fi Speaker",
    category: "Audio & Sound",
    price: 22000,
    originalPrice: 25500,
    badge: "Popular",
    rating: 4.8,
    reviewsCount: 94,
    isFeatured: false,
    isDeal: false,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    description: "360-degree room-filling acoustic sound enclosed in waterproof acoustic fabric with tactile metallic volume control knob.",
    specs: [
      "60W Quad-Driver 360 Acoustic Output",
      "IP67 Dust & Submersible Waterproof",
      "24 Hours Continuous Playtime",
      "PartyLink multiple speaker pairing"
    ]
  },

  // --- Smartwatches ---
  {
    id: "watch-titanium-ultra",
    name: "JoyWatch Ultra Titan GPS",
    category: "Smartwatches",
    price: 38500,
    originalPrice: 44000,
    badge: "Hot Deal",
    rating: 4.9,
    reviewsCount: 160,
    isFeatured: true,
    isDeal: true,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Rugged sapphire crystal display with grade 5 titanium casing, precision dual-frequency GPS, ECG, and blood oxygen health metrics.",
    specs: [
      "49mm Aerospace Titanium Case",
      "3,000 nits Sapphire Crystal Display",
      "Dual-Frequency L1 & L5 Precision GPS",
      "Up to 72 hours low-power battery life"
    ]
  },
  {
    id: "watch-slim-curve",
    name: "Vogue Classic Smartwatch",
    category: "Smartwatches",
    price: 18500,
    originalPrice: 21000,
    badge: "Elegant",
    rating: 4.7,
    reviewsCount: 110,
    isFeatured: false,
    isDeal: false,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    description: "Sleek stainless steel circular dial with Italian leather strap, 100+ fitness workout modes, and Bluetooth phone call functionality.",
    specs: [
      "1.43\" AMOLED Always-On Display",
      "Real-time Heart Rate & Sleep Monitoring",
      "5ATM Water Resistance",
      "Interchangeable 22mm Quick-Release Band"
    ]
  },

  // --- Gaming & Gear ---
  {
    id: "gaming-controller-pro",
    name: "Apex Elite Wireless Gamepad",
    category: "Gaming & Gear",
    price: 9500,
    originalPrice: 11500,
    badge: "Gamer Choice",
    rating: 4.8,
    reviewsCount: 135,
    isFeatured: false,
    isDeal: true,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80",
    description: "Hall-effect zero-drift magnetic joysticks, mechanical microswitch buttons, and customizable rear paddles for PC and consoles.",
    specs: [
      "Hall Effect Anti-Drift Thumbsticks",
      "1000Hz Ultra-Low Latency Wireless Poll Rate",
      "4 Remappable Ergonomic Back Buttons",
      "Vibration Haptic Feedback Dual Motors"
    ]
  },
  {
    id: "gaming-headset-rgb",
    name: "Quantum 7.1 Surround Headset",
    category: "Gaming & Gear",
    price: 13500,
    originalPrice: 16000,
    badge: "Trending",
    rating: 4.7,
    reviewsCount: 88,
    isFeatured: false,
    isDeal: false,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    description: "Ultra-low latency lossless wireless gaming audio with spatial 7.1 directional sound and broadcast-grade detachable microphone.",
    specs: [
      "53mm Neodymium High-Density Drivers",
      "Lossless 2.4GHz + Bluetooth 5.3 + 3.5mm",
      "Cooling gel memory foam ear cushions",
      "ClearCast Bidirectional Noise-Cancelling Mic"
    ]
  },

  // --- Accessories ---
  {
    id: "acc-gan-charger",
    name: "JoyCharge 100W GaN Pro Block",
    category: "Accessories",
    price: 5200,
    originalPrice: 6200,
    badge: "Best Seller",
    rating: 4.9,
    reviewsCount: 420,
    isFeatured: true,
    isDeal: true,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    description: "Compact GaN III fast charger capable of simultaneously powering your laptop, smartphone, and tablet at full speed.",
    specs: [
      "3x USB-C Power Delivery 3.0 (100W Max)",
      "1x USB-A Quick Charge 4.0 (22.5W)",
      "Dynamic GaN III heat dissipation",
      "Universal worldwide 100-240V compatibility"
    ]
  },
  {
    id: "acc-mech-keyboard",
    name: "Slate Minimalist Mechanical Deck",
    category: "Accessories",
    price: 15500,
    originalPrice: 17500,
    badge: "Top Rated",
    rating: 4.9,
    reviewsCount: 210,
    isFeatured: true,
    isDeal: false,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    description: "CNC machined aluminum case with custom sound-dampening gasket mount, hot-swappable switches, and multi-device Bluetooth.",
    specs: [
      "75% Compact Layout with CNC Rotary Knob",
      "Pre-lubed Smooth Linear Switches",
      "Tri-Mode: 2.4GHz / Bluetooth 5.1 / Type-C",
      "South-facing RGB with PBT Double-shot Caps"
    ]
  },
  {
    id: "acc-mag-stand",
    name: "Gravity Magnetic Aluminum Desk Stand",
    category: "Accessories",
    price: 6800,
    originalPrice: 7900,
    badge: "Popular",
    rating: 4.8,
    reviewsCount: 145,
    isFeatured: false,
    isDeal: true,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    description: "Anodized aerospace aluminum stand with strong N52 neodymium magnetic locking and 360-degree dual-axis ergonomic tilt.",
    specs: [
      "Heavy weighted non-slip silicone base",
      "Built-in cable management cut-out",
      "360-degree infinite swivel pivot",
      "Compatible with all magnetic phones and tablets"
    ]
  },
  {
    id: "acc-cable-braided",
    name: "UltraWeave 240W Thunderbolt Cable",
    category: "Accessories",
    price: 2400,
    originalPrice: 2900,
    badge: "Essential",
    rating: 4.9,
    reviewsCount: 190,
    isFeatured: false,
    isDeal: false,
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    description: "Double-braided nylon reinforced 2-meter USB-C cable supporting 240W charging and 40Gbps ultra-fast data transfer.",
    specs: [
      "240W Power Delivery 3.1 Certified",
      "40Gbps 8K Video Display Output",
      "Reinforced zinc alloy connector housing",
      "30,000+ bend laboratory tested lifespan"
    ]
  }
];
