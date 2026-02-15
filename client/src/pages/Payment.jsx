import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Payment() {
    const navigate = useNavigate();
    const [checkoutData, setCheckoutData] = useState(null);
    const [paymentProof, setPaymentProof] = useState(null);
    const [transactionNumber, setTransactionNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('upload'); // 'upload' or 'reference'
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

        if (paymentMethod === 'upload' && !paymentProof) {
            setError('Please upload payment proof');
            return;
        }

        if (paymentMethod === 'reference' && !transactionNumber.trim()) {
            setError('Please enter your transaction reference number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'multipart/form-data' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Create FormData for file upload
            const formData = new FormData();
            if (paymentProof) {
                formData.append('paymentProof', paymentProof);
            }
            if (transactionNumber) {
                formData.append('transactionNumber', transactionNumber);
            }

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
                headers: headers
            });

            if (response.data.success) {
                // Clear cart and checkout data
                localStorage.removeItem('cart');
                localStorage.removeItem('checkoutData');
                window.dispatchEvent(new Event('cartUpdated'));

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
                    <h1 className="text-4xl font-black text-black mb-2">Payment</h1>
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
                        <div className="bg-white rounded-2xl p-8 text-black shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black">
                                🏦 Bank Transfer Details
                            </h2>
                            <div className="space-y-4 bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Bank Name</p>
                                        <p className="text-lg font-bold text-robitro-navy">Barclays Bank UK</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Account Name</p>
                                        <p className="text-lg font-bold text-robitro-navy">Robitro Ltd</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Account Number</p>
                                        <p className="text-lg font-bold tracking-widest text-robitro-navy">12345678</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Sort Code</p>
                                        <p className="text-lg font-bold font-mono text-robitro-navy">20-00-00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Reference</p>
                                        <p className="text-lg font-bold text-robitro-navy font-mono">ORDER-{Date.now().toString().slice(-8)}</p>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Amount to Transfer</p>
                                        <p className="text-3xl font-black text-robitro-navy">£{checkoutData.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Payment Proof / Reference */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                                <Upload className="text-black" size={24} />
                                Provide Payment Proof
                            </h2>

                            {/* Method Selector */}
                            <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('upload')}
                                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${paymentMethod === 'upload' ? 'bg-white text-robitro-blue shadow-sm' : 'text-gray-500'}`}
                                >
                                    Upload Screenshot
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('reference')}
                                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${paymentMethod === 'reference' ? 'bg-white text-robitro-blue shadow-sm' : 'text-gray-500'}`}
                                >
                                    Transaction Number
                                </button>
                            </div>

                            <div className="mb-6">
                                {paymentMethod === 'upload' ? (
                                    <>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Upload Screenshot/Photo of Payment <span className="text-red-500">*</span>
                                        </label>

                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-robitro-blue transition-all cursor-pointer bg-gray-50/50">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="payment-proof"
                                            />
                                            <label htmlFor="payment-proof" className="cursor-pointer">
                                                {previewUrl ? (
                                                    <div>
                                                        <img
                                                            src={previewUrl}
                                                            alt="Payment proof preview"
                                                            className="max-h-64 mx-auto rounded-lg mb-4 shadow-md"
                                                        />
                                                        <p className="text-sm text-green-600 font-semibold flex items-center justify-center gap-2">
                                                            <CheckCircle size={18} />
                                                            File uploaded successfully
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-2">Click to change file</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Upload className="mx-auto text-gray-300 mb-4" size={48} />
                                                        <p className="text-gray-700 font-bold mb-2">Click to upload or drag and drop</p>
                                                        <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 5MB</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Enter Transaction Reference Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={transactionNumber}
                                            onChange={(e) => setTransactionNumber(e.target.value)}
                                            placeholder="e.g. TXN-123456789"
                                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue bg-gray-50/50 font-mono text-lg text-black font-bold"
                                        />
                                        <p className="mt-2 text-xs text-gray-500">
                                            Please enter the unique transaction ID provided by your bank after the transfer.
                                        </p>
                                    </>
                                )}
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-bold text-red-800">Error</p>
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-robitro-blue/5 border border-robitro-blue/10 rounded-xl p-5 mb-8">
                                <p className="text-sm text-robitro-navy">
                                    <span className="font-bold">📝 Important:</span> Please ensure your proof clearly shows:
                                </p>
                                <ul className="mt-2 space-y-1 ml-4 text-sm text-gray-800 list-disc font-medium">
                                    <li>Transaction amount (£{checkoutData.total.toFixed(2)})</li>
                                    <li>Recipient: <span className="font-bold text-robitro-navy">Robitro Ltd</span></li>
                                    <li>Correct Reference Number</li>
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/checkout')}
                                    className="px-6 bg-gray-100 text-robitro-navy font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-robitro-yellow text-gray-900 font-black text-lg py-4 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        'Complete Order'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-black mb-6 pb-2 border-b border-gray-100">Order Summary</h3>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                                {checkoutData.cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <img
                                            src={item.image || item.images?.[0]}
                                            alt={item.name}
                                            className="w-14 h-14 rounded-xl object-cover shadow-sm"
                                        />
                                        <div className="flex-grow">
                                            <p className="text-sm font-bold text-robitro-navy line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500 font-semibold mt-0.5">Quantity: {item.quantity}</p>
                                            <p className="text-sm font-black text-robitro-blue mt-1">£{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-robitro-navy font-bold">£{checkoutData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Shipping</span>
                                    <span className={`font-bold ${checkoutData.shipping === 0 ? 'text-green-600' : 'text-robitro-navy'}`}>
                                        {checkoutData.shipping === 0 ? 'FREE' : `£${checkoutData.shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Tax (20%)</span>
                                    <span className="text-robitro-navy font-bold">£{checkoutData.tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
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
