import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Profile({ user, setUser }) {
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', parentName: '', parentPhone: '', schoolName: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                parentName: user.parentName || '',
                parentPhone: user.parentPhone || '',
                schoolName: user.schoolName || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.put('/auth/profile', formData);
            if (response.data.success) {
                setUser(response.data.user);
                setEditing(false);
                Swal.fire({ title: 'Profile Updated!', text: 'Your profile has been updated successfully.', icon: 'success', confirmButtonColor: '#F59E0B' });
            }
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Failed to update profile', icon: 'error', confirmButtonColor: '#EF4444' });
        } finally {
            setSaving(false);
        }
    };

    const getInitials = () => {
        return `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header */}
            <section className="relative overflow-hidden py-12 lg:py-16">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 70%, #06b6d4 100%)' }}></div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-black text-white border-2 border-white/30">
                            {getInitials()}
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-1">{user?.firstName} {user?.lastName}</h1>
                            <p className="text-white/70">{user?.email}</p>
                            <span className="inline-block mt-2 bg-robitro-yellow text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase">{user?.role || 'Student'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { to: '/lms/dashboard', icon: '📊', label: 'Dashboard' },
                        { to: '/lms/my-courses', icon: '📚', label: 'My Courses' },
                        { to: '/orders', icon: '📦', label: 'Orders' },
                        { to: '/courses', icon: '🎓', label: 'Browse' },
                    ].map(link => (
                        <Link key={link.to} to={link.to} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <span className="text-3xl block mb-2">{link.icon}</span>
                            <span className="text-sm font-semibold text-gray-700">{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                        {!editing ? (
                            <button onClick={() => setEditing(true)} className="text-robitro-blue font-semibold text-sm hover:underline">✏️ Edit</button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setEditing(false)} className="text-gray-500 font-semibold text-sm hover:underline">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="bg-robitro-blue text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { key: 'firstName', label: 'First Name', icon: '👤' },
                            { key: 'lastName', label: 'Last Name', icon: '👤' },
                            { key: 'email', label: 'Email Address', icon: '📧', disabled: true },
                            { key: 'parentName', label: 'Parent / Guardian Name', icon: '👨‍👩‍👧' },
                            { key: 'parentPhone', label: 'Parent Phone', icon: '📱' },
                            { key: 'schoolName', label: 'School Name', icon: '🏫' },
                        ].map(field => (
                            <div key={field.key}>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    {field.icon} {field.label}
                                </label>
                                {editing && !field.disabled ? (
                                    <input
                                        type="text"
                                        value={formData[field.key]}
                                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue/30 text-gray-900"
                                    />
                                ) : (
                                    <p className="text-gray-900 font-semibold py-3 px-4 bg-gray-50 rounded-xl">
                                        {formData[field.key] || '—'}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Account Details</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">🆔 Account ID</label>
                            <p className="text-gray-900 font-mono text-sm py-3 px-4 bg-gray-50 rounded-xl">{user?.id?.slice(0, 16)}...</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">📅 Member Since</label>
                            <p className="text-gray-900 font-semibold py-3 px-4 bg-gray-50 rounded-xl">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">🔑 Role</label>
                            <p className="text-gray-900 font-semibold py-3 px-4 bg-gray-50 rounded-xl capitalize">{user?.role || 'Student'}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">✅ Verified</label>
                            <p className="text-gray-900 font-semibold py-3 px-4 bg-gray-50 rounded-xl">{user?.isVerified ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
