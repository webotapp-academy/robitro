import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const STEPS = ['Organisation', 'Address', 'Contact Person', 'Account'];

const PARTNER_TYPES = [
    { value: 'school', label: '🏫 School', desc: 'K-12 educational institutions' },
    { value: 'franchise', label: '🤝 Franchise', desc: 'Franchise business partners' },
    { value: 'institute', label: '🎓 Institute', desc: 'Coaching & training institutes' },
];

export default function PartnerRegister({ setIsAuthenticated, setUser }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        // Step 0 – Organisation
        name: '',
        partnerType: '',
        email: '',
        phone: '',
        website: '',
        // Step 1 – Address
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        // Step 2 – Contact Person
        contactPersonName: '',
        contactPersonDesignation: '',
        contactPersonPhone: '',
        // Step 3 – Account
        password: '',
        confirmPassword: '',
    });

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    /* ---- Validation per step ---- */
    const validate = () => {
        setError('');
        if (step === 0) {
            if (!form.name.trim()) return setError('Organisation name is required.'), false;
            if (!form.partnerType) return setError('Please select a partner type.'), false;
            if (!form.email.trim()) return setError('Email is required.'), false;
            if (!/\S+@\S+\.\S+/.test(form.email)) return setError('Enter a valid email.'), false;
            if (!form.phone.trim()) return setError('Phone number is required.'), false;
        }
        if (step === 1) {
            if (!form.city.trim()) return setError('City is required.'), false;
            if (!form.state.trim()) return setError('State is required.'), false;
        }
        if (step === 2) {
            if (!form.contactPersonName.trim()) return setError('Contact person name is required.'), false;
        }
        if (step === 3) {
            if (form.password.length < 6) return setError('Password must be at least 6 characters.'), false;
            if (form.password !== form.confirmPassword) return setError('Passwords do not match.'), false;
        }
        return true;
    };

    const next = () => { if (validate()) setStep((s) => s + 1); };
    const back = () => { setError(''); setStep((s) => s - 1); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = {
                name: form.name,
                partnerType: form.partnerType,
                email: form.email,
                phone: form.phone,
                website: form.website,
                street: form.street,
                city: form.city,
                state: form.state,
                postalCode: form.postalCode,
                country: form.country,
                contactPersonName: form.contactPersonName,
                contactPersonDesignation: form.contactPersonDesignation,
                contactPersonPhone: form.contactPersonPhone,
                password: form.password,
            };
            const response = await authService.partnerSignup(payload);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setIsAuthenticated(true);
            setUser(user);
            setSuccess(true);
            setTimeout(() => navigate('/lms/dashboard'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /* ---- Success screen ---- */
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0B1220 0%, #1E3A8A 50%, #0B1220 100%)' }}>
                <div className="text-center px-8">
                    <div className="text-8xl mb-6 animate-bounce">🎉</div>
                    <h2 className="text-4xl font-bold text-white mb-4">Welcome Aboard!</h2>
                    <p className="text-blue-200 text-lg mb-2">Your partner account has been created.</p>
                    <p className="text-yellow-300 text-sm">Awaiting admin approval. Redirecting…</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4"
            style={{ background: 'linear-gradient(135deg, #0B1220 0%, #1E3A8A 60%, #0B1220 100%)' }}
        >
            {/* Decorative blobs */}
            <div style={{ position: 'fixed', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,212,0,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,216,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(255,212,0,0.15)', border: '1px solid rgba(255,212,0,0.3)' }}>
                        <span className="text-yellow-300 text-sm font-semibold">🤝 Partner Programme</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Become a <span style={{ color: '#FFD400' }}>Robitro</span> Partner
                    </h1>
                    <p className="text-blue-200">Join our growing network of educational partners</p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-8 gap-0">
                    {STEPS.map((label, i) => (
                        <div key={i} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                                    style={{
                                        background: i < step ? '#FFD400' : i === step ? 'linear-gradient(135deg, #FFD400, #00B4D8)' : 'rgba(255,255,255,0.1)',
                                        color: i <= step ? '#0B1220' : 'rgba(255,255,255,0.5)',
                                        boxShadow: i === step ? '0 0 20px rgba(255,212,0,0.5)' : 'none',
                                    }}
                                >
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className="text-xs mt-1 hidden sm:block" style={{ color: i === step ? '#FFD400' : 'rgba(255,255,255,0.4)' }}>
                                    {label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    className="h-0.5 w-12 sm:w-20 mx-1 transition-all duration-500"
                                    style={{ background: i < step ? '#FFD400' : 'rgba(255,255,255,0.15)' }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl p-8"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                    }}
                >
                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                            <span className="text-red-400 text-xl">⚠️</span>
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); next(); }}>

                        {/* ===== STEP 0: Organisation ===== */}
                        {step === 0 && (
                            <div className="space-y-5 fade-in">
                                <h3 className="text-xl font-bold text-white mb-6">Organisation Details</h3>

                                {/* Partner Type */}
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-3">Partner Type *</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {PARTNER_TYPES.map((pt) => (
                                            <button
                                                key={pt.value}
                                                type="button"
                                                onClick={() => setForm((prev) => ({ ...prev, partnerType: pt.value }))}
                                                className="p-4 rounded-xl text-left transition-all duration-200"
                                                style={{
                                                    background: form.partnerType === pt.value ? 'rgba(255,212,0,0.2)' : 'rgba(255,255,255,0.05)',
                                                    border: form.partnerType === pt.value ? '2px solid #FFD400' : '2px solid rgba(255,255,255,0.1)',
                                                    color: form.partnerType === pt.value ? '#FFD400' : 'rgba(255,255,255,0.7)',
                                                }}
                                            >
                                                <div className="text-2xl mb-1">{pt.label.split(' ')[0]}</div>
                                                <div className="font-semibold text-sm">{pt.label.split(' ').slice(1).join(' ')}</div>
                                                <div className="text-xs opacity-60 mt-1">{pt.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Organisation Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={set('name')}
                                        placeholder="e.g. Bright Minds Academy"
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={set('email')}
                                            placeholder="partner@school.com"
                                            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={set('phone')}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Website <span className="text-gray-500">(optional)</span></label>
                                    <input
                                        type="url"
                                        value={form.website}
                                        onChange={set('website')}
                                        placeholder="https://yourschool.com"
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ===== STEP 1: Address ===== */}
                        {step === 1 && (
                            <div className="space-y-5 fade-in">
                                <h3 className="text-xl font-bold text-white mb-6">Address Details</h3>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Street Address <span className="text-gray-500">(optional)</span></label>
                                    <input
                                        type="text"
                                        value={form.street}
                                        onChange={set('street')}
                                        placeholder="123, Main Street"
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-2">City *</label>
                                        <input
                                            type="text"
                                            value={form.city}
                                            onChange={set('city')}
                                            placeholder="Mumbai"
                                            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-2">State *</label>
                                        <input
                                            type="text"
                                            value={form.state}
                                            onChange={set('state')}
                                            placeholder="Maharashtra"
                                            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-2">Postal Code <span className="text-gray-500">(optional)</span></label>
                                        <input
                                            type="text"
                                            value={form.postalCode}
                                            onChange={set('postalCode')}
                                            placeholder="400001"
                                            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-2">Country</label>
                                        <input
                                            type="text"
                                            value={form.country}
                                            onChange={set('country')}
                                            placeholder="India"
                                            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== STEP 2: Contact Person ===== */}
                        {step === 2 && (
                            <div className="space-y-5 fade-in">
                                <h3 className="text-xl font-bold text-white mb-6">Contact Person</h3>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={form.contactPersonName}
                                        onChange={set('contactPersonName')}
                                        placeholder="e.g. Rajesh Kumar"
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Designation <span className="text-gray-500">(optional)</span></label>
                                    <input
                                        type="text"
                                        value={form.contactPersonDesignation}
                                        onChange={set('contactPersonDesignation')}
                                        placeholder="e.g. Principal / Director"
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Contact Phone <span className="text-gray-500">(optional)</span></label>
                                    <input
                                        type="tel"
                                        value={form.contactPersonPhone}
                                        onChange={set('contactPersonPhone')}
                                        placeholder="+91 98765 43210"
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                    />
                                </div>

                                {/* Info box */}
                                <div className="p-4 rounded-xl" style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.25)' }}>
                                    <p className="text-blue-200 text-sm">
                                        💡 The contact person will be the primary point of contact for all communications with Robitro.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ===== STEP 3: Account ===== */}
                        {step === 3 && (
                            <div className="space-y-5 fade-in">
                                <h3 className="text-xl font-bold text-white mb-6">Create Your Account</h3>

                                {/* Summary */}
                                <div className="p-4 rounded-xl mb-2" style={{ background: 'rgba(255,212,0,0.08)', border: '1px solid rgba(255,212,0,0.2)' }}>
                                    <p className="text-yellow-300 text-xs font-semibold mb-2 uppercase tracking-wider">Registration Summary</p>
                                    <div className="grid grid-cols-2 gap-1 text-sm">
                                        <span className="text-gray-400">Organisation:</span>
                                        <span className="text-white font-medium">{form.name}</span>
                                        <span className="text-gray-400">Type:</span>
                                        <span className="text-white font-medium capitalize">{form.partnerType}</span>
                                        <span className="text-gray-400">Email:</span>
                                        <span className="text-white font-medium">{form.email}</span>
                                        <span className="text-gray-400">City:</span>
                                        <span className="text-white font-medium">{form.city}, {form.state}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Password *</label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={set('password')}
                                        placeholder="Min. 6 characters"
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                                    />
                                    {/* Password strength bar */}
                                    {form.password && (
                                        <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                            <div
                                                className="h-full rounded-full transition-all duration-300"
                                                style={{
                                                    width: form.password.length >= 10 ? '100%' : form.password.length >= 6 ? '60%' : '30%',
                                                    background: form.password.length >= 10 ? '#22c55e' : form.password.length >= 6 ? '#FFD400' : '#ef4444',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Confirm Password *</label>
                                    <input
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={set('confirmPassword')}
                                        placeholder="Re-enter your password"
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                                        style={{
                                            background: 'rgba(255,255,255,0.08)',
                                            border: form.confirmPassword && form.password !== form.confirmPassword
                                                ? '1px solid rgba(239,68,68,0.6)'
                                                : '1px solid rgba(255,255,255,0.15)',
                                        }}
                                    />
                                    {form.confirmPassword && form.password !== form.confirmPassword && (
                                        <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                                    )}
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                    <input type="checkbox" id="terms" required className="mt-1 accent-yellow-400" />
                                    <label htmlFor="terms" className="text-sm text-gray-400">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-yellow-300 hover:underline">Terms of Service</Link>
                                        {' '}and{' '}
                                        <Link to="/privacy" className="text-yellow-300 hover:underline">Privacy Policy</Link>.
                                        I understand that my account is subject to admin approval.
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 mt-8">
                            {step > 0 && (
                                <button
                                    type="button"
                                    onClick={back}
                                    className="flex-1 py-3 rounded-xl font-semibold transition-all duration-200"
                                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
                                >
                                    ← Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl font-bold text-base transition-all duration-300 disabled:opacity-50"
                                style={{
                                    background: step === 3 ? 'linear-gradient(135deg, #FFD400, #f59e0b)' : 'linear-gradient(135deg, #1F4ED8, #00B4D8)',
                                    color: step === 3 ? '#0B1220' : '#fff',
                                    boxShadow: '0 4px 20px rgba(255,212,0,0.3)',
                                }}
                            >
                                {loading
                                    ? 'Submitting…'
                                    : step === 3
                                        ? '🚀 Create Partner Account'
                                        : `Continue → ${STEPS[step + 1]}`}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-yellow-300 font-semibold hover:underline">
                        Login here
                    </Link>
                    {' · '}
                    <Link to="/student-signup" className="text-blue-300 hover:underline">
                        Register as Student
                    </Link>
                </p>
            </div>
        </div>
    );
}
