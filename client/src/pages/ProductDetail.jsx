import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Random names for "just bought" notifications
  const buyers = [
    { name: 'James', location: 'London' },
    { name: 'Amelia', location: 'Manchester' },
    { name: 'Oliver', location: 'Birmingham' },
    { name: 'Isla', location: 'Leeds' },
    { name: 'Harry', location: 'Glasgow' },
    { name: 'Mia', location: 'Liverpool' },
    { name: 'Jack', location: 'Newcastle' },
    { name: 'Sophia', location: 'Bristol' }
  ];

  // Products data with INR prices
  const products = [
    {
      id: 1,
      name: 'Robitro MEX DIY Robotics Advanced Kit 2.0',
      tagline: 'Master Robotics, Coding & AI',
      description: 'Build Hundreds of Robots like Steering Car, Line follower, Robotic Arm, Humanoid, Artist Robot, Boom Barrier, Piano Robot and many more!',
      category: 'Robotics',
      price: 125,
      mrp: 130,
      rating: 4.8,
      reviews: 324,
      stock: 15,
      ageGroup: '10+ Ages',
      images: [
        'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop'
      ],
      freeCourse: { name: 'Robotics Fundamentals Course', value: 20 },
      features: [
        'Control their movements using the remote control, Robitro mobile app and give exciting sounds to them!',
        'Code them and control them with AI!',
        'Included components: 300+ parts including plastic construction building blocks, programmable brain, motors, sensors, buzzer, LED Matrix & easy-to-follow printed manual',
        'For Ages: 10 to 16',
        'Learn robotics, coding, AI, mechanical design, hands-on skills, problem-solving, logical thinking & creativity',
        '6 months warranty on all electronics',
        'Mobile app compatibility: iOS 11 or above / Android 10 or above',
        'Great indoor playing toy set for kids & parents to spend quality time together',
        'Proudly Made & Designed in UK',
        'Experience the joy of building your own robots & kickstart a lifelong hobby that could become the child\'s passion'
      ],
      skills: [
        { name: 'Robotics', icon: '🤖', quote: '"Robotics will make the world pretty fantastic compared with today." - Bill Gates' },
        { name: 'AI', icon: '🧠', quote: '"AI is the last technology skill that humanity will ever need!" - Nick Bostrom' },
        { name: 'Coding', icon: '💻', quote: '"In 15 years we\'ll be teaching coding just like reading & writing." - Mark Zuckerberg' },
        { name: 'Mechanical Design', icon: '⚙️', quote: '"Because of robots with amazing mechanisms, the quality of work will go up." - Jeff Bezos' },
        { name: 'Model Building', icon: '🏗️', quote: '"Design can help to improve our lives in the present." - Tim Brown' },
        { name: 'Creativity', icon: '🎨', quote: '"Imagination rules the world." - Napoleon Bonaparte' }
      ],
      projects: [
        { name: 'Line Follower', description: 'Master sensor interfacing with the line follower!', image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=300&h=200&fit=crop' },
        { name: 'Robotic Arm', description: 'Ace designing complex Gear Systems with this bot!', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop' },
        { name: 'Humanoid Robot', description: 'Learn gear system and build a walking bot!', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=300&h=200&fit=crop' },
        { name: 'Artist Bot', description: 'Draw patterns with code, app play or AI!', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop' }
      ],
      reviews_list: [
        { name: 'Rahul M.', location: 'London', rating: 5, text: 'My son loves this kit! Built 5 different robots already. The app control is amazing!', date: '2 weeks ago', verified: true },
        { name: 'Priya S.', location: 'Manchester', rating: 5, text: 'Best investment for my daughter. She learned so much about robotics and coding.', date: '1 month ago', verified: true },
        { name: 'Ankit K.', location: 'Birmingham', rating: 4, text: 'Great quality components. Instructions could be more detailed but overall excellent.', date: '1 month ago', verified: true }
      ]
    },
    {
      id: 2,
      name: 'Robitro Arduino Ultimate Pack',
      tagline: 'Learn Electronics & Programming',
      description: 'Everything you need to master Arduino programming. Build weather stations, automated lights, and simple robots!',
      category: 'Arduino',
      price: 40,
      mrp: 60,
      rating: 4.7,
      reviews: 256,
      stock: 22,
      ageGroup: '12+ Ages',
      images: [
        'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop'
      ],
      freeCourse: { name: 'Arduino Programming Course', value: 10 },
      features: [
        'Arduino Uno R3 board with USB cable',
        '40+ electronic components included',
        'Build 10+ guided projects',
        'Perfect for school science projects',
        'Online course access included',
        '6 months warranty on electronics',
        'Compatible with all Arduino IDE versions',
        'Step-by-step project guide included'
      ],
      skills: [
        { name: 'Programming', icon: '💻', quote: '"Programming is the new literacy." - Marc Andreessen' },
        { name: 'Electronics', icon: '⚡', quote: '"Electronics will continue to revolutionize our lives." - Gordon Moore' },
        { name: 'Problem Solving', icon: '🧩', quote: '"The best way to predict the future is to create it." - Peter Drucker' }
      ],
      projects: [
        { name: 'LED Blinker', description: 'Start with the basics!', image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=300&h=200&fit=crop' },
        { name: 'Weather Station', description: 'Monitor temperature & humidity!', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop' }
      ],
      reviews_list: [
        { name: 'David K.', location: 'Leeds', rating: 5, text: 'Perfect for learning Arduino. The online course is excellent!', date: '1 week ago', verified: true },
        { name: 'Lucy T.', location: 'Glasgow', rating: 5, text: 'My son loves it. Great value for money.', date: '3 weeks ago', verified: true }
      ]
    },
    {
      id: 3,
      name: 'Robitro AI Learning Board',
      tagline: 'Explore Artificial Intelligence',
      description: 'Hands-on AI experiments with image recognition, voice control, and machine learning projects.',
      category: 'AI & ML',
      price: 70,
      mrp: 100,
      rating: 4.6,
      reviews: 178,
      stock: 8,
      ageGroup: '14+ Ages',
      images: [
        'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&h=600&fit=crop'
      ],
      freeCourse: { name: 'Python for AI Course', value: 15 },
      features: [
        'AI Camera module for image recognition',
        'Voice recognition module',
        'Python programming guide included',
        'Cloud AI account setup',
        '8 guided AI projects',
        'Compatible with Raspberry Pi',
        '6 months warranty'
      ],
      skills: [
        { name: 'AI', icon: '🧠', quote: '"AI is the new electricity." - Andrew Ng' },
        { name: 'Python', icon: '🐍', quote: '"Python is the future of programming." - Guido van Rossum' }
      ],
      projects: [
        { name: 'Face Detection', description: 'Build your own face detector!', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=300&h=200&fit=crop' }
      ],
      reviews_list: [
        { name: 'Alex W.', location: 'Liverpool', rating: 5, text: 'Incredible kit for learning AI!', date: '5 days ago', verified: true }
      ]
    },
    {
      id: 4,
      name: 'Robitro Drone Building Kit',
      tagline: 'Build & Fly Your Own Drone',
      description: 'Build and program your own quadcopter drone. Learn aerodynamics and flight control.',
      category: 'Drones',
      price: 90,
      mrp: 130,
      rating: 4.9,
      reviews: 145,
      stock: 5,
      ageGroup: '14+ Ages',
      images: [
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506947411487-a56738267384?w=600&h=600&fit=crop'
      ],
      freeCourse: { name: 'Drone Flying Basics', value: 8 },
      features: [
        '4 Brushless motors with propellers',
        'Flight controller board',
        'LiPo battery with charger',
        'Remote controller included',
        'Up to 12 minutes flight time',
        'FPV camera (optional setup)',
        'Safety guide & regulations'
      ],
      skills: [
        { name: 'Aerodynamics', icon: '✈️', quote: '"The sky is not the limit, it\'s just the beginning."' },
        { name: 'Engineering', icon: '🔧', quote: '"Engineering is the art of making the impossible possible."' }
      ],
      projects: [
        { name: 'Quadcopter', description: 'Build a flying machine!', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=300&h=200&fit=crop' }
      ],
      reviews_list: [
        { name: 'Tom K.', location: 'Newcastle', rating: 5, text: 'Built it with my son. Flies great!', date: '1 week ago', verified: true }
      ]
    },
    {
      id: 5,
      name: 'Robitro Electronics Explorer Kit',
      tagline: 'Start Your Electronics Journey',
      description: 'Learn electronics from scratch! Build circuits, understand components, and create LED projects.',
      category: 'Electronics',
      price: 25,
      mrp: 40,
      rating: 4.8,
      reviews: 289,
      stock: 30,
      ageGroup: '8+ Ages',
      images: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop'
      ],
      freeCourse: { name: 'Basic Electronics Course', value: 5 },
      features: [
        'Breadboard and LED pack',
        '50+ electronic components',
        '12 guided project cards',
        'Perfect for beginners',
        'Colorful instruction manual',
        'Battery holder included'
      ],
      skills: [
        { name: 'Electronics', icon: '💡', quote: '"Electricity is the soul of the universe." - Nikola Tesla' }
      ],
      projects: [
        { name: 'LED Flasher', description: 'Create blinking patterns!', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop' }
      ],
      reviews_list: [
        { name: 'Jenny L.', location: 'Bristol', rating: 5, text: 'Perfect for young learners!', date: '3 days ago', verified: true }
      ]
    },
    {
      id: 6,
      name: 'Robitro IoT Smart Home Kit',
      tagline: 'Create Connected Devices',
      description: 'Build smart lights, sensors, and home automation projects with this IoT kit.',
      category: 'Electronics',
      price: 50,
      mrp: 80,
      rating: 4.6,
      reviews: 167,
      stock: 12,
      ageGroup: '12+ Ages',
      images: [
        'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&h=600&fit=crop'
      ],
      freeCourse: { name: 'IoT Fundamentals Course', value: 7 },
      features: [
        'ESP32 WiFi board',
        'Temperature and motion sensors',
        'LED strip included',
        'Mobile app access',
        'Cloud account setup',
        '6 IoT guided projects'
      ],
      skills: [
        { name: 'IoT', icon: '🏠', quote: '"The Internet of Things will change everything."' }
      ],
      projects: [
        { name: 'Smart Light', description: 'Control with your phone!', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=300&h=200&fit=crop' }
      ],
      reviews_list: [
        { name: 'Peter S.', location: 'Sheffield', rating: 5, text: 'Built a complete smart room!', date: '1 week ago', verified: true }
      ]
    },
    {
      id: 7,
      name: 'Robitro Coding Robot Buddy',
      tagline: 'First Steps to Coding',
      description: 'Adorable programmable robot for young coders. Learn logic and sequences through play.',
      category: 'Robotics',
      price: 35,
      mrp: 50,
      rating: 4.9,
      reviews: 412,
      stock: 18,
      ageGroup: '5+ Ages',
      images: [
        'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop'
      ],
      freeCourse: { name: 'Coding for Kids Course', value: 4 },
      features: [
        'Block coding cards (40 pcs)',
        'Activity maps (3 pcs)',
        'USB charging cable',
        'Up to 2 hours play time',
        'Music and sound effects',
        'Color sensors included'
      ],
      skills: [
        { name: 'Logic', icon: '🧩', quote: '"Logic will get you from A to B. Imagination will take you everywhere." - Einstein' }
      ],
      projects: [],
      reviews_list: [
        { name: 'Hannah M.', location: 'Edinburgh', rating: 5, text: 'My 6-year-old is obsessed!', date: '4 days ago', verified: true }
      ]
    },
    {
      id: 8,
      name: 'Robitro Solar Power Kit',
      tagline: 'Go Green with Solar',
      description: 'Build solar-powered projects! Learn renewable energy and eco-friendly technology.',
      category: 'Solar',
      price: 20,
      mrp: 30,
      rating: 4.5,
      reviews: 98,
      stock: 25,
      ageGroup: '8+ Ages',
      images: [
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=600&fit=crop'
      ],
      freeCourse: { name: 'Solar Energy Basics', value: 3 },
      features: [
        '3 Solar panels included',
        'DC motors (2 pcs)',
        'No batteries needed',
        '8 solar project cards',
        'Science facts booklet',
        'Eco-friendly packaging'
      ],
      skills: [
        { name: 'Sustainability', icon: '🌱', quote: '"The future is green energy, sustainability, renewable energy."' }
      ],
      projects: [
        { name: 'Solar Car', description: 'Race using sunlight!', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop' }
      ],
      reviews_list: [
        { name: 'Grace W.', location: 'Belfast', rating: 5, text: 'Love the eco-friendly concept!', date: '1 week ago', verified: true }
      ]
    },
    {
      id: 9,
      name: 'Robitro Sensor Mega Pack',
      tagline: '30+ Sensors for Endless Projects',
      description: '30+ sensors for all your projects! Temperature, motion, sound, light, and more.',
      category: 'Arduino',
      price: 15,
      mrp: 25,
      rating: 4.7,
      reviews: 234,
      stock: 40,
      ageGroup: '12+ Ages',
      images: [
        'https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop'
      ],
      freeCourse: null,
      features: [
        '30+ different sensors',
        'Compatible with Arduino & Raspberry Pi',
        'Jumper wire pack included',
        'Code examples on USB',
        'Digital documentation'
      ],
      skills: [],
      projects: [],
      reviews_list: [
        { name: 'Nick L.', location: 'Brighton', rating: 5, text: 'Incredible value!', date: '5 days ago', verified: true }
      ]
    }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        if (response.data.success) {
          const dbProduct = response.data.product;
          // Map DB format to UI format
          const mappedProduct = {
            ...dbProduct,
            ...dbProduct.metadata,
            category: dbProduct.category?.name || dbProduct.categoryName || 'Uncategorized',
            mrp: dbProduct.metadata?.originalPrice || (dbProduct.price * 1.2),
            reviews: dbProduct.metadata?.reviews || 0,
            features: dbProduct.metadata?.features || [],
            skills: dbProduct.metadata?.skills || [],
            projects: dbProduct.metadata?.projects || [],
            reviews_list: dbProduct.metadata?.reviews_list || []
          };
          setProduct(mappedProduct);
          setCurrentImage(0);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // "Just bought" notification
  useEffect(() => {
    if (!product) return;

    const showNotification = () => {
      const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
      setNotification(randomBuyer);
      setTimeout(() => setNotification(null), 5000);
    };

    const interval = setInterval(showNotification, 15000);
    setTimeout(showNotification, 3000);

    return () => clearInterval(interval);
  }, [product]);

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryInfo({
        available: true,
        date: 'Feb 5 - Feb 7',
        cod: true
      });
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    window.location.href = '/cart';
  };

  const discount = product ? Math.round((1 - product.price / product.mrp) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-4 border-robitro-blue mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Loading Product...</h2>
          <p className="text-gray-500">Please wait while we fetch the product details</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-robitro-navy mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-robitro-blue font-semibold hover:underline">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* "Just Bought" Notification */}
      {notification && (
        <div className="fixed bottom-24 left-4 z-50 max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-slide-up">
          <button onClick={() => setNotification(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">×</button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🎉</div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-robitro-navy">{notification.name}</span> from <span className="font-semibold">{notification.location}</span> just bought
              </p>
              <p className="text-sm font-bold text-robitro-blue">{product.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-xl font-black text-robitro-navy">£ {product.price.toLocaleString('en-GB')} /-</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">£ {product.mrp.toLocaleString('en-GB')}</span>
              <span className="text-sm text-green-600 font-bold">{discount}% off</span>
            </div>
          </div>
          <button
            onClick={handleBuyNow}
            className="px-8 py-3 bg-robitro-yellow text-gray-900 font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <section className="py-6 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* ========== LEFT - IMAGES ========== */}
            <div>
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4 aspect-square">
                <img
                  src={product.images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`rounded-xl overflow-hidden aspect-square border-2 transition-all ${currentImage === idx ? 'border-robitro-blue ring-2 ring-robitro-blue/30' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ========== RIGHT - DETAILS ========== */}
            <div>
              {/* Category & Age Badges */}
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-robitro-blue text-white text-sm font-semibold rounded-full">{product.category}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">{product.ageGroup}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-black text-robitro-navy mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-lg font-bold text-gray-700">{product.rating}</span>
                <div className="flex text-robitro-yellow">
                  {'★'.repeat(Math.floor(product.rating))}
                  {product.rating % 1 >= 0.5 && '☆'}
                </div>
                <span className="text-gray-500">({product.reviews})</span>
              </div>

              {/* Tagline */}
              <p className="text-lg font-semibold text-robitro-blue mb-4">{product.tagline}</p>

              {/* Price Section */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-black text-robitro-navy">£ {product.price.toLocaleString('en-GB')} /-</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">M.R.P.:</span>
                  <span className="text-gray-500 line-through">£ {product.mrp.toLocaleString('en-GB')} /-</span>
                  <span className="text-green-600 font-bold">{discount}% off</span>
                </div>
              </div>

              {/* Share Button */}
              <button className="flex items-center gap-2 text-robitro-blue font-semibold mb-4 hover:underline">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>

              {/* Free Course Banner */}
              {product.freeCourse && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎁</div>
                    <div>
                      <p className="font-bold text-green-700">
                        Unlock a <span className="text-green-600">£ {product.freeCourse.value.toLocaleString('en-GB')} /-</span> course FREE only with this kit!
                      </p>
                      <p className="text-sm text-green-600">{product.freeCourse.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Coupons */}
              <button
                onClick={() => setShowCoupons(!showCoupons)}
                className="flex items-center gap-2 text-robitro-purple font-semibold mb-4 hover:underline"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                View Available Coupons
              </button>

              {showCoupons && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-robitro-purple">ROBITRO10</span>
                    <span className="text-sm text-gray-600">10% off on first order</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-robitro-purple">NEWUSER5</span>
                    <span className="text-sm text-gray-600">£5 off above £50</span>
                  </div>
                </div>
              )}

              {/* Buy Now Button (Desktop) */}
              <button
                onClick={handleBuyNow}
                className="hidden lg:flex w-full items-center justify-center gap-2 py-4 bg-robitro-yellow text-gray-900 font-bold text-lg rounded-xl hover:shadow-lg transition-all mb-4"
              >
                🛒 Buy Now
              </button>

              {/* Pincode Check */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Pincode</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit pincode"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue"
                  />
                  <button
                    onClick={checkDelivery}
                    className="px-6 py-3 bg-robitro-blue text-white font-semibold rounded-xl hover:bg-robitro-blue/90 transition-all"
                  >
                    Check Delivery
                  </button>
                </div>
                {deliveryInfo && (
                  <div className="mt-3 p-3 bg-green-50 rounded-xl text-green-700">
                    <p className="font-semibold">✓ Delivery available!</p>
                    <p className="text-sm">Expected: {deliveryInfo.date}</p>
                    {deliveryInfo.cod && <p className="text-sm">COD Available</p>}
                  </div>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-2">
                {product.features.slice(0, 5).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-robitro-blue text-sm mt-0.5">•</span>
                    <p className="text-gray-700 text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FULL WIDTH DESCRIPTION ==================== */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-robitro-blue/10 text-robitro-blue text-sm font-bold rounded-full mb-4">PRODUCT DETAILS</span>
            <h2 className="section-title">What You Get</h2>
          </div>
          <div className="space-y-4">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-robitro-blue/10 text-robitro-blue rounded-full text-lg font-bold">✓</span>
                <p className="text-gray-700 text-lg leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SKILLS SECTION ==================== */}
      {product.skills && product.skills.length > 0 && (
        <section className="w-full bg-gradient-to-br from-robitro-blue via-robitro-purple to-robitro-teal py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-2 bg-white/20 text-white text-sm font-bold rounded-full mb-4">SKILLS</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Skills You'll Learn</h2>
              <p className="text-white/80 max-w-2xl mx-auto">Master future-ready skills that will set your child apart</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {product.skills.map((skill, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all">
                  <div className="text-3xl mb-2">{skill.icon}</div>
                  <h3 className="text-sm font-semibold text-white mb-1">{skill.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== PROJECTS SECTION ==================== */}
      {product.projects && product.projects.length > 0 && (
        <section className="w-full bg-gradient-to-br from-white to-gray-50 py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-2 bg-robitro-teal/10 text-robitro-teal text-sm font-bold rounded-full mb-4">BUILD</span>
              <h2 className="section-title">Projects You Can Build</h2>
              <p className="section-subtitle">Create amazing robots and gadgets with step-by-step guidance</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.projects.map((project, idx) => (
                <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group">
                  <div className="h-28 overflow-hidden">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-robitro-navy mb-1">{project.name}</h3>
                    <p className="text-xs text-gray-500">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== TRUST BADGES ==================== */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-robitro-yellow/10 text-robitro-navy text-sm font-bold rounded-full mb-4">WHY ROBITRO</span>
            <h2 className="section-title">Why Buy From Us</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '💳', title: 'Card & PayPal', description: 'Easy payment' },
              { icon: '🛡️', title: '6 Month Warranty', description: 'All electronics' },
              { icon: '👨‍🏫', title: 'Expert Support', description: 'Mentors available' },
              { icon: '🚚', title: 'Free Shipping', description: 'All UK orders' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-sm font-semibold text-robitro-navy mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== REVIEWS SECTION (HOME STYLE) ==================== */}
      <section className="w-full bg-gradient-to-br from-white to-gray-50 py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 bg-robitro-yellow/10 text-robitro-navy text-sm font-bold rounded-full mb-4">TESTIMONIALS</span>
            <h2 className="section-title">Customer Reviews</h2>
            <p className="section-subtitle">Hear from happy parents and kids who love our kits</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {product.reviews_list.map((review, idx) => (
              <div key={idx} className={`bg-white rounded-2xl p-6 shadow-lg border-t-4 ${idx === 0 ? 'border-robitro-yellow' : idx === 1 ? 'border-robitro-blue' : 'border-robitro-teal'} hover:scale-105 hover:shadow-xl transition-all duration-300`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => <span key={i} className="text-robitro-yellow text-lg">★</span>)}
                </div>
                <p className="text-gray-700 font-medium mb-4 leading-relaxed italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-robitro-yellow to-robitro-orange flex items-center justify-center text-lg shadow-md">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-robitro-navy">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.location} • {review.date}</p>
                  </div>
                </div>
                {review.verified && (
                  <div className="mt-3 text-xs text-green-600 font-medium">✓ Verified Purchase</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== YOU MAY ALSO LIKE ==================== */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-robitro-blue/10 text-robitro-blue text-sm font-bold rounded-full mb-4">EXPLORE</span>
            <h2 className="section-title">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/shop/${relatedProduct.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">{relatedProduct.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-yellow-500 text-xs">★</span>
                      <span className="text-xs text-gray-500">{relatedProduct.rating}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-gray-900">£{relatedProduct.price.toLocaleString('en-GB')}</span>
                      <span className="text-xs text-gray-400 line-through">£{relatedProduct.mrp.toLocaleString('en-GB')}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 lg:hidden"></div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

