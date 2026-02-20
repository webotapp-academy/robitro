import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, User, Package, ShoppingBag, X } from 'lucide-react';
import CrudPage from './CrudPage.jsx';

// ========================
// MANAGEMENT PAGES
// ========================

export function AdminUsers() {
    return <CrudPage title="Users" endpoint="/users" fields={[
        { key: 'firstName', label: 'First Name', showInTable: true },
        { key: 'lastName', label: 'Last Name', showInTable: true },
        { key: 'email', label: 'Email', showInTable: true },
        {
            key: 'role', label: 'Role', type: 'select', showInTable: true, options: [
                { value: 'student', label: 'Student' }, { value: 'admin', label: 'Admin' },
                { value: 'instructor', label: 'Instructor' }, { value: 'partner', label: 'Partner' },
            ]
        },
        {
            key: 'status', label: 'Status', type: 'select', showInTable: true, options: [
                { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' },
            ]
        },
        { key: 'password', label: 'Password', type: 'password' },
    ]} />;
}

export function AdminPartners() {
    return <CrudPage title="Partners" endpoint="/partners" fields={[
        { key: 'name', label: 'Name', showInTable: true },
        {
            key: 'partnerType', label: 'Type', type: 'select', showInTable: true, default: 'school', options: [
                { value: 'school', label: 'School' }, { value: 'franchise', label: 'Franchise' }, { value: 'institute', label: 'Institute' },
            ]
        },

        { key: 'email', label: 'Email', showInTable: true },
        { key: 'phone', label: 'Phone', showInTable: true },
        { key: 'website', label: 'Website' },
        { key: 'commissionPercent', label: 'Commission %', type: 'number', default: 15 },
        { key: 'approved', label: 'Approved', type: 'switch', showInTable: true, default: false },
    ]} />;
}

export function AdminCourses() {
    const navigate = useNavigate();
    return <CrudPage
        title="Courses"
        endpoint="/courses"
        searchable={true}
        onAdd={() => navigate('/admin/courses/add')}
        onEdit={(item) => navigate(`/admin/courses/edit/${item.id}`)}
        fields={[
            { key: 'title', label: 'Title', showInTable: true },
            { key: 'category', label: 'Category', showInTable: true },
            { key: 'level', label: 'Level', showInTable: true },
            { key: 'price', label: 'Price (£)', type: 'number', showInTable: true },
            { key: 'status', label: 'Status', showInTable: true },
            { key: 'enrollmentCount', label: 'Enrollments', showInTable: true },
        ]}
    />;
}

export function AdminProducts() {
    const navigate = useNavigate();
    return <CrudPage
        title="Products"
        endpoint="/products"
        searchable={true}
        onAdd={() => navigate('/admin/products/add')}
        onEdit={(item) => navigate(`/admin/products/edit/${item.id}`)}
        fields={[
            { key: 'name', label: 'Product Name', showInTable: true },
            { key: 'categoryName', label: 'Category', showInTable: true },
            { key: 'price', label: 'Price (£)', type: 'number', showInTable: true },
            { key: 'stock', label: 'Stock', type: 'number', showInTable: true },
            { key: 'status', label: 'Status', showInTable: true },
        ]}
    />;
}

export function AdminOrders() {
    const [viewOrder, setViewOrder] = useState(null);

    return (
        <>
            <CrudPage
                title="Orders"
                endpoint="/orders"
                canAdd={false}
                fields={[
                    { key: 'id', label: 'Order ID', showInTable: true, editable: false },
                    { key: 'totalAmount', label: 'Amount (£)', type: 'number', showInTable: true, editable: false },
                    { key: 'currency', label: 'Currency', showInTable: true, editable: false },
                    {
                        key: 'status', label: 'Status', type: 'select', showInTable: true, options: [
                            { value: 'pending', label: 'Pending' }, { value: 'processing', label: 'Processing' },
                            { value: 'completed', label: 'Completed' }, { value: 'cancelled', label: 'Cancelled' },
                        ]
                    },
                    { key: 'paymentType', label: 'Payment Type', showInTable: true, editable: false },
                    { key: 'transactionNumber', label: 'Transaction #', showInTable: true, editable: false },
                ]}
                customActions={(order) => (
                    <button
                        onClick={() => setViewOrder(order)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye size={15} />
                    </button>
                )}
            />

            {/* Order Details Modal */}
            {viewOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setViewOrder(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-robitro-blue to-robitro-teal px-6 py-5 border-b border-gray-100 flex justify-between items-center rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-bold text-white">Order Details</h3>
                                <p className="text-white/80 text-sm mt-1">#{viewOrder.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setViewOrder(null)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h4 className="text-sm font-bold text-robitro-navy uppercase tracking-wider mb-4">Order Summary</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                        <p className="text-lg font-black text-robitro-blue">£{viewOrder.totalAmount?.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${viewOrder.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            viewOrder.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                viewOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {viewOrder.status?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Payment Type</p>
                                        <p className="text-sm font-bold text-robitro-navy">{viewOrder.paymentType || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Transaction #</p>
                                        <p className="text-sm font-bold text-robitro-navy">{viewOrder.transactionNumber || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200">
                                <h4 className="text-sm font-bold text-robitro-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <User size={16} className="text-robitro-blue" />
                                    Customer Details
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Name</p>
                                        <p className="font-bold text-robitro-navy">{viewOrder.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                        <p className="font-bold text-robitro-navy">{viewOrder.customerEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                                        <p className="font-bold text-robitro-navy">{viewOrder.customerPhone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200">
                                <h4 className="text-sm font-bold text-robitro-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Package size={16} className="text-robitro-blue" />
                                    Shipping Address
                                </h4>
                                <div className="text-sm space-y-1">
                                    <p className="font-bold text-robitro-navy">{viewOrder.shippingAddress}</p>
                                    <p className="text-gray-600">{viewOrder.shippingCity}, {viewOrder.shippingPostcode}</p>
                                    <p className="text-gray-600">{viewOrder.shippingCountry}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200">
                                <h4 className="text-sm font-bold text-robitro-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <ShoppingBag size={16} className="text-robitro-blue" />
                                    Order Items
                                </h4>
                                <div className="space-y-3">
                                    {viewOrder.items && Array.isArray(viewOrder.items) && viewOrder.items.map((item, index) => (
                                        <Link
                                            key={index}
                                            to={`/shop/${item.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors group"
                                        >
                                            {item.image && (
                                                <img
                                                    src={item.image || item.images?.[0]}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="flex-grow">
                                                <h5 className="font-bold text-robitro-navy text-sm group-hover:text-robitro-blue transition-colors">{item.name}</h5>
                                                <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-black text-robitro-blue mt-1">
                                                    £{item.price} × {item.quantity} = £{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-gray-300 group-hover:text-robitro-blue">
                                                <Eye size={14} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h4 className="text-sm font-bold text-robitro-navy uppercase tracking-wider mb-4">Price Breakdown</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-bold text-robitro-navy">£{viewOrder.subtotal?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-bold text-robitro-navy">
                                            {viewOrder.shipping === 0 ? 'FREE' : `£${viewOrder.shipping?.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (20%)</span>
                                        <span className="font-bold text-robitro-navy">£{viewOrder.tax?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-200">
                                        <span className="font-bold text-robitro-navy">Total</span>
                                        <span className="text-xl font-black text-robitro-blue">£{viewOrder.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes */}
                            {viewOrder.orderNotes && (
                                <div className="bg-white rounded-xl p-5 border border-gray-200">
                                    <h4 className="text-sm font-bold text-robitro-navy uppercase tracking-wider mb-3">Order Notes</h4>
                                    <p className="text-sm text-gray-600">{viewOrder.orderNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export function AdminCommunity() {
    return <CrudPage title="Community Posts" endpoint="/community" searchable={false} fields={[
        { key: 'title', label: 'Title', showInTable: true, editable: false },
        { key: 'category', label: 'Category', showInTable: true, editable: false },
        { key: 'likesCount', label: 'Likes', showInTable: true, editable: false },
        { key: 'commentsCount', label: 'Comments', showInTable: true, editable: false },
        { key: 'status', label: 'Status', showInTable: true, editable: false },
    ]} />;
}

export function AdminEnrollments() {
    return <CrudPage title="Enrollments" endpoint="/enrollments" searchable={false} canAdd={false} fields={[
        { key: 'studentName', label: 'Student', showInTable: true, editable: false },
        { key: 'studentEmail', label: 'Email', showInTable: true, editable: false },
        { key: 'courseTitle', label: 'Course', showInTable: true, editable: false },
        { key: 'paymentAmount', label: 'Amount (£)', showInTable: true, editable: false },
        {
            key: 'paymentStatus', label: 'Payment', type: 'select', showInTable: true, options: [
                { value: 'pending', label: 'Pending' }, { value: 'paid', label: 'Paid' }, { value: 'failed', label: 'Failed' },
            ]
        },
        { key: 'transactionNumber', label: 'Transaction #', showInTable: true, editable: false },
        {
            key: 'status', label: 'Enrollment Status', type: 'select', showInTable: true, options: [
                { value: 'ongoing', label: 'Ongoing' }, { value: 'completed', label: 'Completed' }, { value: 'dropped', label: 'Dropped' },
            ]
        },
        { key: 'progressPercentage', label: 'Progress %', showInTable: true, editable: false },
    ]} />;
}

export function AdminLeads() {
    return <CrudPage title="Course Leads" endpoint="/leads" canAdd={false} fields={[
        { key: 'name', label: 'Name', showInTable: true },
        { key: 'email', label: 'Email', showInTable: true },
        { key: 'phone', label: 'Phone', showInTable: true },
        { key: 'course.title', label: 'Course', showInTable: true, editable: false },
        {
            key: 'status', label: 'Status', type: 'select', showInTable: true, options: [
                { value: 'pending', label: 'Pending' }, { value: 'contacted', label: 'Contacted' },
                { value: 'enrolled', label: 'Enrolled' }, { value: 'closed', label: 'Closed' }
            ]
        },
        { key: 'createdAt', label: 'Date', showInTable: true, editable: false },
    ]} />;
}

export function AdminCallbacks() {
    return <CrudPage title="Callback Requests" endpoint="/callbacks" canAdd={false} fields={[
        { key: 'name', label: 'Name', showInTable: true },
        { key: 'phone', label: 'Phone', showInTable: true },
        { key: 'preferredTime', label: 'Preferred Time', showInTable: true },
        { key: 'course.title', label: 'Course', showInTable: true, editable: false },
        {
            key: 'status', label: 'Status', type: 'select', showInTable: true, options: [
                { value: 'pending', label: 'Pending' }, { value: 'called', label: 'Called' }, { value: 'closed', label: 'Closed' }
            ]
        },
        { key: 'createdAt', label: 'Date', showInTable: true, editable: false },
    ]} />;
}

// ========================
// CMS PAGES
// ========================

export function CmsHero() {
    return <CrudPage title="Hero Sections" endpoint="/cms/hero" searchable={false} fields={[
        {
            key: 'page', label: 'Page', type: 'select', showInTable: true, default: 'home', options: [
                { value: 'home', label: 'Home' }, { value: 'community', label: 'Community' },
                { value: 'courses', label: 'Courses' }, { value: 'shop', label: 'Shop' },
            ]
        },
        { key: 'title', label: 'Title', showInTable: true },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { key: 'ctaText', label: 'CTA Text' },
        { key: 'ctaLink', label: 'CTA Link' },
        { key: 'backgroundImage', label: 'Background Image URL' },
        { key: 'badgeText', label: 'Badge Text' },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
        { key: 'displayOrder', label: 'Order', type: 'number', showInTable: true, default: 0 },
    ]} />;
}

export function CmsFeatures() {
    return <CrudPage title="Feature Cards" endpoint="/cms/features" searchable={false} fields={[
        { key: 'icon', label: 'Icon (emoji/class)', showInTable: true },
        { key: 'title', label: 'Title', showInTable: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'gradient', label: 'Gradient CSS' },
        { key: 'image', label: 'Image URL' },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
        { key: 'displayOrder', label: 'Order', type: 'number', showInTable: true, default: 0 },
    ]} />;
}

export function CmsTestimonials() {
    return <CrudPage title="Testimonials" endpoint="/cms/testimonials" searchable={false} fields={[
        { key: 'name', label: 'Name', showInTable: true },
        { key: 'age', label: 'Age', type: 'number' },
        { key: 'country', label: 'Country', showInTable: true },
        { key: 'quote', label: 'Quote', type: 'textarea', showInTable: true },
        { key: 'avatar', label: 'Avatar URL' },
        { key: 'rating', label: 'Rating (1-5)', type: 'number', showInTable: true, default: 5 },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
        { key: 'displayOrder', label: 'Order', type: 'number', default: 0 },
    ]} />;
}

export function CmsFaqs() {
    return <CrudPage title="FAQs" endpoint="/cms/faqs" searchable={false} fields={[
        { key: 'question', label: 'Question', showInTable: true },
        { key: 'answer', label: 'Answer', type: 'textarea', showInTable: true },
        {
            key: 'category', label: 'Category', type: 'select', showInTable: true, default: 'general', options: [
                { value: 'general', label: 'General' }, { value: 'courses', label: 'Courses' },
                { value: 'payments', label: 'Payments' }, { value: 'technical', label: 'Technical' },
            ]
        },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
        { key: 'displayOrder', label: 'Order', type: 'number', default: 0 },
    ]} />;
}

export function CmsBanners() {
    return <CrudPage title="Banners" endpoint="/cms/banners" searchable={false} fields={[
        { key: 'title', label: 'Title', showInTable: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'image', label: 'Image URL', showInTable: true },
        { key: 'link', label: 'Link URL' },
        {
            key: 'position', label: 'Position', type: 'select', showInTable: true, default: 'top', options: [
                { value: 'top', label: 'Top' }, { value: 'sidebar', label: 'Sidebar' },
                { value: 'popup', label: 'Popup' }, { value: 'footer', label: 'Footer' },
            ]
        },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
        { key: 'displayOrder', label: 'Order', type: 'number', default: 0 },
    ]} />;
}

export function CmsTechBites() {
    return <CrudPage title="Tech Bites" endpoint="/cms/tech-bites" searchable={false} fields={[
        { key: 'title', label: 'Title', showInTable: true },
        { key: 'videoUrl', label: 'YouTube Video URL', showInTable: true },
        { key: 'thumbnail', label: 'Thumbnail URL' },
        { key: 'views', label: 'Views', type: 'number', showInTable: true, default: 0 },
        { key: 'duration', label: 'Duration (e.g. 0:45)', showInTable: true },
        { key: 'category', label: 'Category', default: 'general' },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
        { key: 'displayOrder', label: 'Order', type: 'number', default: 0 },
    ]} />;
}

export function CmsMakers() {
    return <CrudPage title="Master Makers" endpoint="/cms/makers" searchable={false} fields={[
        { key: 'name', label: 'Name', showInTable: true },
        { key: 'role', label: 'Role / Title', showInTable: true },
        { key: 'avatar', label: 'Avatar (emoji or URL)' },
        { key: 'level', label: 'Level', type: 'number', showInTable: true, default: 1 },
        { key: 'projects', label: 'Projects Count', type: 'number', default: 0 },
        { key: 'followers', label: 'Followers', showInTable: true },
        { key: 'badge', label: 'Badge (emoji)' },
        { key: 'gradient', label: 'Gradient CSS' },
        { key: 'profileUrl', label: 'Profile URL' },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
        { key: 'displayOrder', label: 'Order', type: 'number', default: 0 },
    ]} />;
}

export function CmsProjects() {
    return <CrudPage title="Project Showcase" endpoint="/cms/projects" searchable={false} fields={[
        { key: 'title', label: 'Title', showInTable: true },
        { key: 'author', label: 'Author', showInTable: true },
        { key: 'tag', label: 'Tag', showInTable: true },
        { key: 'image', label: 'Image (emoji or URL)' },
        { key: 'color', label: 'Color Gradient CSS' },
        { key: 'likes', label: 'Likes', type: 'number', showInTable: true, default: 0 },
        {
            key: 'category', label: 'Category', type: 'select', showInTable: true, default: 'all', options: [
                { value: 'all', label: 'All' }, { value: 'robotics', label: 'Robotics' },
                { value: 'coding', label: 'Coding' }, { value: 'iot', label: 'IoT' }, { value: 'creative', label: 'Creative' },
            ]
        },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'projectUrl', label: 'Project URL' },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
        { key: 'displayOrder', label: 'Order', type: 'number', default: 0 },
    ]} />;
}

export function CmsChallenges() {
    return <CrudPage title="Challenges" endpoint="/cms/challenges" searchable={false} fields={[
        { key: 'title', label: 'Title', showInTable: true },
        { key: 'subtitle', label: 'Subtitle' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'prize', label: 'Prize', showInTable: true },
        { key: 'registeredCount', label: 'Registered', type: 'number', showInTable: true, default: 0 },
        { key: 'registrationUrl', label: 'Registration URL' },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
    ]} />;
}

export function CmsSocialLinks() {
    return <CrudPage title="Social Links" endpoint="/cms/social-links" searchable={false} fields={[
        { key: 'platform', label: 'Platform', showInTable: true },
        { key: 'url', label: 'URL', showInTable: true },
        { key: 'handle', label: 'Handle', showInTable: true },
        { key: 'followerCount', label: 'Followers' },
        { key: 'icon', label: 'Icon' },
        { key: 'isActive', label: 'Active', type: 'switch', showInTable: true, default: true },
        { key: 'displayOrder', label: 'Order', type: 'number', default: 0 },
    ]} />;
}

export function CmsSettings() {
    return <CrudPage title="Site Settings" endpoint="/cms/settings" searchable={false} fields={[
        { key: 'key', label: 'Key', showInTable: true },
        { key: 'value', label: 'Value', type: 'textarea', showInTable: true },
        {
            key: 'type', label: 'Type', type: 'select', showInTable: true, default: 'text', options: [
                { value: 'text', label: 'Text' }, { value: 'image', label: 'Image URL' },
                { value: 'json', label: 'JSON' }, { value: 'boolean', label: 'Boolean' }, { value: 'number', label: 'Number' },
            ]
        },
        {
            key: 'group', label: 'Group', type: 'select', showInTable: true, default: 'general', options: [
                { value: 'general', label: 'General' }, { value: 'seo', label: 'SEO' },
                { value: 'branding', label: 'Branding' }, { value: 'contact', label: 'Contact' },
                { value: 'legal', label: 'Legal' },
            ]
        },
        { key: 'label', label: 'Display Label' },
    ]} />;
}

export function AdminProductCategories() {
    return <CrudPage title="Product Categories" endpoint="/product-categories" fields={[
        { key: 'name', label: 'Category Name', showInTable: true, editable: true },
        { key: 'slug', label: 'Slug', showInTable: true, editable: true },
        { key: 'description', label: 'Description', type: 'textarea', showInTable: true, editable: true },
    ]} />;
}

export function AdminCourseCategories() {
    return <CrudPage title="Course Categories" endpoint="/course-categories" fields={[
        { key: 'name', label: 'Category Name', showInTable: true, editable: true },
        { key: 'slug', label: 'Slug', showInTable: true, editable: true },
        { key: 'description', label: 'Description', type: 'textarea', showInTable: true, editable: true },
    ]} />;
}
