import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Mail, Home } from 'lucide-react';
import api from '../services/api';

export default function ThankYou() {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const orderId = localStorage.getItem('lastOrderId');
            if (!orderId) {
                navigate('/');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await api.get(`/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setOrder(response.data.order);
                }
            } catch (err) {
                console.error('Error fetching order:', err);
            } finally {
                setLoading(false);
                // Clear the last order ID
                localStorage.removeItem('lastOrderId');
            }
        };

        fetchOrder();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-robitro-blue mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gradient-to-b from-green-50 to-white min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Animation */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 animate-bounce">
                        <CheckCircle className="text-white" size={56} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-robitro-navy mb-4">
                        Order Placed Successfully! 🎉
                    </h1>
                    <p className="text-xl text-gray-600">
                        Thank you for your purchase! We've received your order.
                    </p>
                </div>

                {/* Order Details Card */}
                {order && (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                        {/* Order Header */}
                        <div className="bg-gradient-to-r from-robitro-blue to-robitro-purple p-8 text-white">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="text-sm text-white/80 mb-1">Order Number</p>
                                    <p className="text-2xl font-black">#{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-sm text-white/80 mb-1">Order Total</p>
                                    <p className="text-3xl font-black text-robitro-yellow">£{order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                {/* Customer Details */}
                                <div>
                                    <h3 className="text-lg font-bold text-robitro-navy mb-4 flex items-center gap-2">
                                        <Mail className="text-robitro-blue" size={20} />
                                        Customer Details
                                    </h3>
                                    <div className="space-y-2 text-gray-700">
                                        <p><span className="font-semibold">Name:</span> {order.customerName}</p>
                                        <p><span className="font-semibold">Email:</span> {order.customerEmail}</p>
                                        <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <h3 className="text-lg font-bold text-robitro-navy mb-4 flex items-center gap-2">
                                        <Package className="text-robitro-blue" size={20} />
                                        Shipping Address
                                    </h3>
                                    <div className="text-gray-700">
                                        <p>{order.shippingAddress}</p>
                                        <p>{order.shippingCity}, {order.shippingPostcode}</p>
                                        <p>{order.shippingCountry}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-robitro-navy mb-4">Order Items</h3>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                            <img
                                                src={item.image || item.images?.[0]}
                                                alt={item.name}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                            <div className="flex-grow">
                                                <h4 className="font-semibold text-robitro-navy">{item.name}</h4>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-bold text-robitro-blue">£{item.price} × {item.quantity} = £{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">£{order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">{order.shipping === 0 ? 'FREE' : `£${order.shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tax (20%)</span>
                                        <span className="font-semibold">£{order.tax.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-robitro-navy">Total Paid</span>
                                    <span className="text-2xl font-black text-robitro-blue">£{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* What's Next */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-robitro-navy mb-4">What Happens Next?</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-robitro-blue text-white rounded-full flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="font-bold text-robitro-navy mb-1">Payment Verification</h3>
                                <p className="text-gray-700">Our team will verify your payment proof within 24 hours.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-robitro-blue text-white rounded-full flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="font-bold text-robitro-navy mb-1">Order Confirmation</h3>
                                <p className="text-gray-700">You'll receive a confirmation email at <span className="font-semibold">{order?.customerEmail}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-robitro-blue text-white rounded-full flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 className="font-bold text-robitro-navy mb-1">Shipping</h3>
                                <p className="text-gray-700">Your order will be dispatched within 2-3 business days.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-robitro-blue text-white rounded-full flex items-center justify-center font-bold">4</div>
                            <div>
                                <h3 className="font-bold text-robitro-navy mb-1">Delivery</h3>
                                <p className="text-gray-700">Estimated delivery: 5-7 business days across the UK.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/"
                        className="flex-1 bg-robitro-yellow text-gray-900 font-bold py-4 rounded-xl hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                    <Link
                        to="/shop"
                        className="flex-1 bg-white text-robitro-navy font-semibold py-4 rounded-xl hover:shadow-md transition-all text-center border-2 border-robitro-navy"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Support */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Need help? Contact us at{' '}
                        <a href="mailto:support@robitro.com" className="text-robitro-blue font-semibold hover:underline">
                            support@robitro.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
