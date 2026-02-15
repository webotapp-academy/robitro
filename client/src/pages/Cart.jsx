import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(storedCart);
    } catch (err) {
      console.error('Error loading cart:', err);
      setCart([]);
    }
    setLoading(false);
  };

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    updateCart(updatedCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 50 ? 0 : 5;
  const tax = Math.round(subtotal * 0.20 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-robitro-blue mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Cart...</h3>
          <p className="text-gray-500">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-robitro-navy mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items before checkout</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-lg border border-gray-100">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-robitro-navy mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-robitro-yellow text-gray-900 font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all"
            >
              <ShoppingBag size={20} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.name}
                          className="w-28 h-28 rounded-xl object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-robitro-navy mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition p-2"
                            title="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Control */}
                          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-600 hover:text-robitro-navy transition p-1 hover:bg-white rounded-lg"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="text-robitro-navy font-bold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-600 hover:text-robitro-navy transition p-1 hover:bg-white rounded-lg"
                            >
                              <Plus size={18} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-2xl font-black text-robitro-navy">£{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                <h2 className="text-2xl font-bold text-robitro-navy mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-semibold">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">{shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (20%)</span>
                    <span className="font-semibold">£{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                  <span className="text-xl font-bold text-robitro-navy">Total</span>
                  <span className="text-3xl font-black text-robitro-blue">£{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-robitro-yellow text-gray-900 font-bold py-4 rounded-xl hover:shadow-lg transition-all mb-3 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <Link
                  to="/shop"
                  className="block w-full text-center bg-gray-100 text-robitro-navy font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Continue Shopping
                </Link>

                {/* Free Shipping Notice */}
                {subtotal < 50 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-700">
                      <span className="font-bold">💡 Tip:</span> Add £{(50 - subtotal).toFixed(2)} more to get <span className="font-bold">FREE shipping!</span>
                    </p>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>Fast UK delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
