import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Payment() {
    const navigate = useNavigate();
    const [checkoutData, setCheckoutData] = useState(null);
    const [paymentProof, setPaymentProof] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load checkout data
        const data = JSON.parse(localStorage.getItem('checkoutData') || 'null');
        if (!data) {
            navigate('/cart');
            return;
        }
        setCheckoutData(data);
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setPaymentProof(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentProof) {
            setError('Please upload payment proof');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to complete your order');
                navigate('/login');
                return;
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('paymentProof', paymentProof);
            formData.append('customerName', checkoutData.customerName);
            formData.append('customerEmail', checkoutData.customerEmail);
            formData.append('customerPhone', checkoutData.customerPhone);
            formData.append('shippingAddress', checkoutData.shippingAddress);
            formData.append('shippingCity', checkoutData.shippingCity);
            formData.append('shippingPostcode', checkoutData.shippingPostcode);
            formData.append('shippingCountry', checkoutData.shippingCountry);
            formData.append('orderNotes', checkoutData.orderNotes || '');
            formData.append('items', JSON.stringify(checkoutData.cart));
            formData.append('subtotal', checkoutData.subtotal);
            formData.append('shipping', checkoutData.shipping);
            formData.append('tax', checkoutData.tax);
            formData.append('totalAmount', checkoutData.total);

            // Submit order
            const response = await api.post('/orders', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // Clear cart and checkout data
                localStorage.removeItem('cart');
                localStorage.removeItem('checkoutData');

                // Store order ID for thank you page
                localStorage.setItem('lastOrderId', response.data.order.id);

                // Navigate to thank you page
                navigate('/thank-you');
            }
        } catch (err) {
            console.error('Order submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!checkoutData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-robitro-blue mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-robitro-navy mb-2">Payment</h1>
                    <p className="text-gray-600">Complete your payment via bank transfer</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</div>
                            <span className="ml-2 text-sm font-semibold text-gray-700">Cart</span>
                        </div>
                        <div className="w-16 h-1 bg-green-500"></div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</div>
                            <span className="ml-2 text-sm font-semibold text-gray-700">Checkout</span>
                        </div>
                        <div className="w-16 h-1 bg-robitro-blue"></div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-robitro-blue text-white flex items-center justify-center font-bold">3</div>
                            <span className="ml-2 text-sm font-semibold text-robitro-blue">Payment</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Instructions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Bank Details */}
                        <div className="bg-gradient-to-br from-robitro-blue to-robitro-purple rounded-2xl p-8 text-white shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                🏦 Bank Transfer Details
                            </h2>
                            <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div>
                                    <p className="text-sm text-white/70 mb-1">Bank Name</p>
                                    <p className="text-lg font-bold">Barclays Bank UK</p>
                                </div>
                                <div>
                                    <p className="text-sm text-white/70 mb-1">Account Name</p>
                                    <p className="text-lg font-bold">Robitro Ltd</p>
                                </div>
                                <div>
                                    <p className="text-sm text-white/70 mb-1">Account Number</p>
                                    <p className="text-lg font-bold">12345678</p>
                                </div>
                                <div>
                                    <p className="text-sm text-white/70 mb-1">Sort Code</p>
                                    <p className="text-lg font-bold">20-00-00</p>
                                </div>
                                <div>
                                    <p className="text-sm text-white/70 mb-1">Reference</p>
                                    <p className="text-lg font-bold">ORDER-{Date.now().toString().slice(-8)}</p>
                                </div>
                                <div className="pt-4 border-t border-white/20">
                                    <p className="text-sm text-white/70 mb-1">Amount to Transfer</p>
                                    <p className="text-3xl font-black text-robitro-yellow">£{checkoutData.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Upload Payment Proof */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-robitro-navy mb-6 flex items-center gap-2">
                                <Upload className="text-robitro-blue" size={24} />
                                Upload Payment Proof
                            </h2>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Upload Screenshot/Photo of Payment <span className="text-red-500">*</span>
                                </label>

                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-robitro-blue transition-all cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="payment-proof"
                                        required
                                    />
                                    <label htmlFor="payment-proof" className="cursor-pointer">
                                        {previewUrl ? (
                                            <div>
                                                <img
                                                    src={previewUrl}
                                                    alt="Payment proof preview"
                                                    className="max-h-64 mx-auto rounded-lg mb-4"
                                                />
                                                <p className="text-sm text-green-600 font-semibold flex items-center justify-center gap-2">
                                                    <CheckCircle size={18} />
                                                    File uploaded successfully
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">Click to change file</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                                                <p className="text-gray-700 font-semibold mb-2">Click to upload or drag and drop</p>
                                                <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                <p className="text-sm text-blue-700">
                                    <span className="font-bold">📝 Important:</span> Please ensure your payment proof clearly shows:
                                </p>
                                <ul className="mt-2 ml-4 text-sm text-blue-600 list-disc">
                                    <li>Transaction amount (£{checkoutData.total.toFixed(2)})</li>
                                    <li>Transaction date and time</li>
                                    <li>Recipient details (Robitro Ltd)</li>
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/checkout')}
                                    className="flex-1 bg-gray-100 text-robitro-navy font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !paymentProof}
                                    className="flex-1 bg-robitro-yellow text-gray-900 font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting Order...' : 'Complete Order'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-robitro-navy mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                                {checkoutData.cart.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <img
                                            src={item.image || item.images?.[0]}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold text-robitro-navy line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>£{checkoutData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{checkoutData.shipping === 0 ? 'FREE' : `£${checkoutData.shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>£{checkoutData.tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-robitro-navy">Total</span>
                                <span className="text-2xl font-black text-robitro-blue">£{checkoutData.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
