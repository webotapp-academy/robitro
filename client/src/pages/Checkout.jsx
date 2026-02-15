import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, Mail, Phone, MapPin, FileText } from 'lucide-react';

export default function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        shippingCity: '',
        shippingPostcode: '',
        shippingCountry: 'United Kingdom',
        orderNotes: ''
    });

    useEffect(() => {
        // Load cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (storedCart.length === 0) {
            navigate('/cart');
            return;
        }
        setCart(storedCart);

        // Pre-fill user data if logged in
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (token && user) {
            setFormData(prev => ({
                ...prev,
                customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                customerEmail: user.email || ''
            }));
        }
    }, [navigate]);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 5;
    const tax = Math.round(subtotal * 0.20 * 100) / 100;
    const total = subtotal + shipping + tax;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.customerName || !formData.customerEmail || !formData.customerPhone ||
            !formData.shippingAddress || !formData.shippingCity || !formData.shippingPostcode) {
            alert('Please fill in all required fields');
            return;
        }

        // Store checkout data in localStorage
        const checkoutData = {
            ...formData,
            cart,
            subtotal,
            shipping,
            tax,
            total
        };
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

        // Navigate to payment page
        navigate('/payment');
    };

    return (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-robitro-navy mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your order details</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</div>
                            <span className="ml-2 text-sm font-semibold text-gray-700">Cart</span>
                        </div>
                        <div className="w-16 h-1 bg-robitro-blue"></div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-robitro-blue text-white flex items-center justify-center font-bold">2</div>
                            <span className="ml-2 text-sm font-semibold text-robitro-blue">Checkout</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-300"></div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold">3</div>
                            <span className="ml-2 text-sm font-semibold text-gray-400">Payment</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-robitro-navy mb-6 flex items-center gap-2">
                                    <User className="text-robitro-blue" size={24} />
                                    Customer Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-black"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="customerPhone"
                                            value={formData.customerPhone}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="+44 7700 900000"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-robitro-navy mb-6 flex items-center gap-2">
                                    <MapPin className="text-robitro-blue" size={24} />
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Street Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="shippingAddress"
                                            value={formData.shippingAddress}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="123 Main Street"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-black"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="shippingCity"
                                                value={formData.shippingCity}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="London"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Postcode <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="shippingPostcode"
                                                value={formData.shippingPostcode}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="SW1A 1AA"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-black"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="shippingCountry"
                                            value={formData.shippingCountry}
                                            onChange={handleInputChange}
                                            readOnly
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-black font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                <h2 className="text-2xl font-bold text-robitro-navy mb-6 flex items-center gap-2">
                                    <FileText className="text-robitro-blue" size={24} />
                                    Order Notes (Optional)
                                </h2>
                                <textarea
                                    name="orderNotes"
                                    value={formData.orderNotes}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Any special instructions for your order..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue resize-none text-black"
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                                <h2 className="text-2xl font-bold text-robitro-navy mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <img
                                                src={item.image || item.images?.[0]}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-grow">
                                                <h4 className="text-sm font-semibold text-robitro-navy line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold text-robitro-blue">£{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
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

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xl font-bold text-robitro-navy">Total</span>
                                    <span className="text-3xl font-black text-robitro-blue">£{total.toFixed(2)}</span>
                                </div>

                                {/* Action Buttons */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-robitro-yellow text-gray-900 font-bold py-4 rounded-xl hover:shadow-lg transition-all mb-3 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Continue to Payment'}
                                    <ArrowRight size={20} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/cart')}
                                    className="w-full bg-gray-100 text-robitro-navy font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={18} />
                                    Back to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
