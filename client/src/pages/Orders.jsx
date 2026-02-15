import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data.orders || response.data.data || []);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        const s = {
            pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', icon: '⏳', label: 'Payment Pending' },
            processing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', icon: '⚙️', label: 'Processing' },
            shipped: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500', icon: '🚚', label: 'Shipped' },
            delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', icon: '✅', label: 'Delivered' },
            cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', icon: '❌', label: 'Cancelled' },
        };
        return s[status] || s.pending;
    };

    const formatDate = (d) => {
        if (!d) return 'N/A';
        return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    const getItemName = (item) => item.name || item.productName || item.product?.name || 'Product';
    const getItemImage = (item) => item.thumbnail || item.image || item.product?.thumbnail || item.product?.images?.[0] || null;
    const getItemPrice = (item) => item.price ?? item.product?.price ?? 0;
    const getItemQty = (item) => item.quantity ?? 1;

    const getItems = (order) => {
        if (!order.items) return [];
        return Array.isArray(order.items) ? order.items : [];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-robitro-yellow border-t-robitro-blue mx-auto mb-6"></div>
                    <p className="text-robitro-navy font-semibold text-lg">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header */}
            <section className="relative overflow-hidden py-12 lg:py-14">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 70%, #06b6d4 100%)' }}></div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-400/15 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">My Orders</h1>
                            <p className="text-white/70">Track and manage your purchases</p>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/shop" className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all text-sm">
                                🛍️ Continue Shopping
                            </Link>
                        </div>
                    </div>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {[
                            { label: 'Total Orders', value: orders.length, icon: '📦' },
                            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: '⏳' },
                            { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: '✅' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <span className="text-xl block mb-1">{s.icon}</span>
                                <p className="text-2xl font-black text-white">{s.value}</p>
                                <p className="text-white/60 text-xs font-semibold">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Orders */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20">
                        <div className="text-7xl mb-6">🛍️</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Explore our shop for exciting robotics kits, components, and educational tools!
                        </p>
                        <Link to="/shop" className="inline-block bg-gradient-to-r from-robitro-blue to-robitro-teal text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all">
                            🛒 Browse Shop
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const items = getItems(order);
                            const st = getStatusStyle(order.status);
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                    {/* Order Header Bar */}
                                    <div
                                        className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    >
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                            {/* Order Number */}
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Order ID</p>
                                                <p className="text-sm font-bold text-gray-900 font-mono">#{order.id?.slice(-8)?.toUpperCase()}</p>
                                            </div>
                                            {/* Date */}
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Placed On</p>
                                                <p className="text-sm font-semibold text-gray-700">{formatDate(order.createdAt)} · {formatTime(order.createdAt)}</p>
                                            </div>
                                            {/* Items Count */}
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Items</p>
                                                <p className="text-sm font-semibold text-gray-700">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                                            </div>
                                            {/* Total */}
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Total</p>
                                                <p className="text-sm font-black text-gray-900">£{(order.totalAmount || 0).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Status Badge */}
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                                                <span className={`w-2 h-2 rounded-full ${st.dot} animate-pulse`}></span>
                                                {st.label}
                                            </span>
                                            {/* Expand Arrow */}
                                            <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                                        </div>
                                    </div>

                                    {/* Product Items - Always show mini preview */}
                                    <div className="border-t border-gray-100">
                                        {/* Compact Product Row */}
                                        <div className="px-6 py-3">
                                            <div className="flex items-center gap-3 overflow-x-auto">
                                                {items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 min-w-0 flex-shrink-0">
                                                        {/* Product Image */}
                                                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                                            {getItemImage(item) ? (
                                                                <img src={getItemImage(item).startsWith('http') ? getItemImage(item) : `http://localhost:5001${getItemImage(item)}`} alt={getItemName(item)} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-robitro-blue to-robitro-teal flex items-center justify-center text-white text-lg">📦</div>
                                                            )}
                                                        </div>
                                                        {/* Product Details */}
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{getItemName(item)}</p>
                                                            <p className="text-xs text-gray-500">Qty: {getItemQty(item)} × £{getItemPrice(item).toFixed(2)}</p>
                                                        </div>
                                                        {idx < items.length - 1 && <span className="text-gray-200 mx-2">|</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 bg-gray-50/50">
                                            {/* Detailed Items */}
                                            <div className="px-6 py-4 space-y-4">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Items</h4>
                                                {items.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-100">
                                                        {/* Large Product Image */}
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                                            {getItemImage(item) ? (
                                                                <img src={getItemImage(item).startsWith('http') ? getItemImage(item) : `http://localhost:5001${getItemImage(item)}`} alt={getItemName(item)} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-robitro-blue to-robitro-teal flex items-center justify-center text-white text-2xl">📦</div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-base font-bold text-gray-900 mb-1">{getItemName(item)}</h5>
                                                            {item.category && <span className="inline-block text-[11px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mb-2">{item.category}</span>}
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span>Qty: <strong className="text-gray-900">{getItemQty(item)}</strong></span>
                                                                <span>Unit Price: <strong className="text-gray-900">£{getItemPrice(item).toFixed(2)}</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-lg font-black text-gray-900">£{(getItemPrice(item) * getItemQty(item)).toFixed(2)}</p>
                                                            <p className="text-[11px] text-gray-400 mt-0.5">subtotal</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Summary */}
                                            <div className="px-6 py-4 grid md:grid-cols-2 gap-6 border-t border-gray-100">
                                                {/* Shipping Info */}
                                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">📍 Shipping Address</h4>
                                                    <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{order.shippingAddress}</p>
                                                    <p className="text-sm text-gray-600">{order.shippingCity}, {order.shippingPostcode}</p>
                                                    <p className="text-sm text-gray-600">{order.shippingCountry}</p>
                                                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                                                        <p className="text-xs text-gray-500">📧 {order.customerEmail}</p>
                                                        <p className="text-xs text-gray-500">📱 {order.customerPhone}</p>
                                                    </div>
                                                </div>

                                                {/* Payment Summary */}
                                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">💰 Payment Summary</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Subtotal</span>
                                                            <span className="font-semibold text-gray-900">£{(order.subtotal || 0).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Shipping</span>
                                                            <span className="font-semibold text-gray-900">{(order.shipping || 0) > 0 ? `£${order.shipping.toFixed(2)}` : 'Free'}</span>
                                                        </div>
                                                        {(order.tax || 0) > 0 && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Tax</span>
                                                                <span className="font-semibold text-gray-900">£{order.tax.toFixed(2)}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between text-base pt-2 border-t border-gray-100">
                                                            <span className="font-bold text-gray-900">Total</span>
                                                            <span className="font-black text-robitro-blue text-lg">£{(order.totalAmount || 0).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-400">Payment Method</span>
                                                            <span className="font-semibold text-gray-700 capitalize">{order.paymentType?.replace('_', ' ') || 'Bank Transfer'}</span>
                                                        </div>
                                                        {order.transactionNumber && (
                                                            <div className="flex justify-between text-xs mt-1">
                                                                <span className="text-gray-400">Transaction #</span>
                                                                <span className="font-semibold text-gray-700 font-mono">{order.transactionNumber}</span>
                                                            </div>
                                                        )}
                                                        {order.trackingNumber && (
                                                            <div className="flex justify-between text-xs mt-1">
                                                                <span className="text-gray-400">Tracking #</span>
                                                                <span className="font-semibold text-robitro-blue font-mono">{order.trackingNumber}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Notes */}
                                            {order.orderNotes && (
                                                <div className="px-6 pb-4">
                                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                                        <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">📝 Order Notes</h4>
                                                        <p className="text-sm text-amber-800">{order.orderNotes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
