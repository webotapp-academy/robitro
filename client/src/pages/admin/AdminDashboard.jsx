import { useState, useEffect } from 'react';
import { Users, GraduationCap, ShoppingBag, ShoppingCart, BookOpen, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                if (res.data.success) setData(res.data.data);
            } catch (err) {
                console.error('Dashboard error:', err);
            }
            setLoading(false);
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-robitro-blue" /></div>;

    const stats = data?.stats || {};
    const cards = [
        { label: 'Total Users', value: stats.users || 0, icon: Users, color: 'from-robitro-blue to-blue-600', bg: 'bg-blue-50' },
        { label: 'Courses', value: stats.courses || 0, icon: GraduationCap, color: 'from-robitro-teal to-cyan-500', bg: 'bg-cyan-50' },
        { label: 'Products', value: stats.products || 0, icon: ShoppingBag, color: 'from-robitro-yellow to-yellow-500', bg: 'bg-yellow-50' },
        { label: 'Orders', value: stats.orders || 0, icon: ShoppingCart, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
        { label: 'Enrollments', value: stats.enrollments || 0, icon: BookOpen, color: 'from-purple-500 to-violet-500', bg: 'bg-purple-50' },
        { label: 'Community Posts', value: stats.posts || 0, icon: MessageSquare, color: 'from-robitro-red to-rose-500', bg: 'bg-red-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Icon size={22} />
                                </div>
                                <TrendingUp size={16} className="text-green-500" />
                            </div>
                            <p className="text-3xl font-black text-robitro-navy">{card.value.toLocaleString()}</p>
                            <p className="text-sm text-robitro-gray font-medium mt-1">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Users & Orders */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-robitro-navy mb-4">Recent Users</h3>
                    <div className="space-y-3">
                        {(data?.recentUsers || []).map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-robitro-blue to-robitro-teal flex items-center justify-center text-white text-xs font-bold">
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-robitro-navy">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-robitro-gray">{user.email}</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 bg-robitro-blue/10 text-robitro-blue text-[10px] font-bold rounded-full uppercase">{user.role}</span>
                            </div>
                        ))}
                        {(!data?.recentUsers?.length) && <p className="text-sm text-robitro-gray text-center py-4">No users yet</p>}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-robitro-navy mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                        {(data?.recentOrders || []).map(order => (
                            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm font-bold text-robitro-navy">{order.user?.firstName} {order.user?.lastName}</p>
                                    <p className="text-xs text-robitro-gray">₹{order.totalAmount}</p>
                                </div>
                                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                            </div>
                        ))}
                        {(!data?.recentOrders?.length) && <p className="text-sm text-robitro-gray text-center py-4">No orders yet</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
