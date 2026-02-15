import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, ShoppingBag, ShoppingCart,
    BookOpen, MessageSquare, Image, Star, HelpCircle, Settings,
    Megaphone, Video, Award, Trophy, Share2, ChevronLeft, ChevronRight,
    LogOut, Menu, X
} from 'lucide-react';

const sidebarItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { type: 'divider', label: 'Management' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Partners', icon: BookOpen, path: '/admin/partners' },
    { label: 'Courses', icon: GraduationCap, path: '/admin/courses' },
    { label: 'Products', icon: ShoppingBag, path: '/admin/products' },
    { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Community', icon: MessageSquare, path: '/admin/community' },
    { label: 'Enrollments', icon: Award, path: '/admin/enrollments' },
    { type: 'divider', label: 'CMS' },
    { label: 'Hero Sections', icon: Image, path: '/admin/cms/hero' },
    { label: 'Features', icon: Star, path: '/admin/cms/features' },
    { label: 'Testimonials', icon: MessageSquare, path: '/admin/cms/testimonials' },
    { label: 'FAQs', icon: HelpCircle, path: '/admin/cms/faqs' },
    { label: 'Banners', icon: Megaphone, path: '/admin/cms/banners' },
    { label: 'Tech Bites', icon: Video, path: '/admin/cms/tech-bites' },
    { label: 'Master Makers', icon: Trophy, path: '/admin/cms/makers' },
    { label: 'Project Showcase', icon: Award, path: '/admin/cms/projects' },
    { label: 'Challenges', icon: Trophy, path: '/admin/cms/challenges' },
    { label: 'Social Links', icon: Share2, path: '/admin/cms/social-links' },
    { label: 'Site Settings', icon: Settings, path: '/admin/cms/settings' },
];

export default function AdminLayout({ setIsAuthenticated, setUser, user }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-5 border-b border-gray-700/50">
                <Link to="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-robitro-yellow to-yellow-400 rounded-xl flex items-center justify-center text-robitro-navy font-black text-lg shadow-lg">
                        R
                    </div>
                    {!collapsed && <span className="text-white font-bold text-lg">Robitro Admin</span>}
                </Link>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {sidebarItems.map((item, idx) => {
                    if (item.type === 'divider') {
                        return !collapsed ? (
                            <div key={idx} className="pt-4 pb-2 px-3">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                            </div>
                        ) : <div key={idx} className="h-px bg-gray-700/50 my-3" />;
                    }

                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={idx}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-gradient-to-r from-robitro-blue/20 to-robitro-teal/10 text-robitro-yellow border border-robitro-blue/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
              `}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon size={18} className={isActive ? 'text-robitro-yellow' : ''} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700/50 space-y-2">
                <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>
                    <ChevronLeft size={18} />
                    {!collapsed && <span>Back to Site</span>}
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                    <LogOut size={18} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col bg-[#0f172a] transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'} shrink-0`}>
                <SidebarContent />
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute bottom-20 -right-3 w-6 h-6 bg-robitro-blue rounded-full flex items-center justify-center text-white shadow-lg hover:bg-robitro-teal transition-colors z-50 hidden lg:flex"
                    style={{ left: collapsed ? '60px' : '248px' }}
                >
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>
            </aside>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0f172a] z-50">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="bg-[#0f172a] border-b border-gray-700/50 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-bold text-white">
                            {sidebarItems.find(i => i.path === location.pathname)?.label || 'Admin Panel'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white hidden sm:inline-block">
                            {user?.firstName || 'Admin'}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-robitro-blue to-robitro-teal flex items-center justify-center text-white text-xs font-bold">
                            {user?.firstName?.[0] || 'A'}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
