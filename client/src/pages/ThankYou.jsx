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
                    <h1 className="text-2xl md:text-3xl font-black text-black mb-4">
                        Order Placed Successfully! 🎉
                    </h1>
                    <p className="text-lg text-black">
                        Thank you for your purchase! We've received your order.
                    </p>
                </div>

                {/* Order Details Card */}
                {order && (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-8">
                        {/* Order Header */}
                        <div className="bg-gray-100 p-8 text-black border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider font-bold text-black mb-1">Order Number</p>
                                    <p className="text-xl font-black text-black">#{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-xs uppercase tracking-wider font-bold text-black mb-1">Order Total</p>
                                    <p className="text-2xl font-black text-black">£{order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                {/* Customer Details */}
                                <div>
                                    <h3 className="text-base font-bold text-black mb-4 flex items-center gap-2">
                                        <Mail className="text-black" size={18} />
                                        Customer Details
                                    </h3>
                                    <div className="space-y-2 text-black text-sm">
                                        <p className="text-black"><span className="font-bold">Name:</span> {order.customerName}</p>
                                        <p className="text-black"><span className="font-bold">Email:</span> {order.customerEmail}</p>
                                        <p className="text-black"><span className="font-bold">Phone:</span> {order.customerPhone}</p>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <h3 className="text-base font-bold text-black mb-4 flex items-center gap-2">
                                        <Package className="text-black" size={18} />
                                        Shipping Address
                                    </h3>
                                    <div className="text-black text-sm">
                                        <p className="text-black">{order.shippingAddress}</p>
                                        <p className="text-black">{order.shippingCity}, {order.shippingPostcode}</p>
                                        <p className="text-black">{order.shippingCountry}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-8">
                                <h3 className="text-base font-bold text-black mb-4">Order Items</h3>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <img
                                                src={item.image || item.images?.[0]}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-lg object-cover grayscale-[0.5]"
                                            />
                                            <div className="flex-grow">
                                                <h4 className="text-sm font-bold text-black">{item.name}</h4>
                                                <p className="text-xs text-black font-medium">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-black text-black mt-1">£{item.price} × {item.quantity} = £{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 text-sm">
                                    <div className="flex justify-between text-black">
                                        <span>Subtotal</span>
                                        <span className="font-bold">£{order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-black">
                                        <span>Shipping</span>
                                        <span className="font-bold">{order.shipping === 0 ? 'FREE' : `£${order.shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-black">
                                        <span>Tax (20%)</span>
                                        <span className="font-bold">£{order.tax.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-black">Total Paid</span>
                                    <span className="text-xl font-black text-black">£{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* What's Next */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-8">
                    <h2 className="text-lg font-bold text-black mb-6">What Happens Next?</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                            <div>
                                <h3 className="text-sm font-bold text-black mb-1">Payment Verification</h3>
                                <p className="text-sm text-black">Our team will verify your payment proof within 24 hours.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                            <div>
                                <h3 className="text-sm font-bold text-black mb-1">Order Confirmation</h3>
                                <p className="text-sm text-black">You'll receive a confirmation email at <span className="font-bold">{order?.customerEmail}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                            <div>
                                <h3 className="text-sm font-bold text-black mb-1">Shipping</h3>
                                <p className="text-sm text-black">Your order will be dispatched within 2-3 business days.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                            <div>
                                <h3 className="text-sm font-bold text-black mb-1">Delivery</h3>
                                <p className="text-sm text-black">Estimated delivery: 5-7 business days across the UK.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/"
                        className="flex-1 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all text-center flex items-center justify-center gap-2"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                    <Link
                        to="/shop"
                        className="flex-1 bg-white text-black font-bold py-4 rounded-xl shadow-sm hover:bg-gray-50 transition-all text-center border-2 border-black"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Support */}
                <div className="mt-8 text-center">
                    <p className="text-black text-sm">
                        Need help? Contact us at{' '}
                        <a href="mailto:support@robitro.com" className="font-bold underline hover:no-underline">
                            support@robitro.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
