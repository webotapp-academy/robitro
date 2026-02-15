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
    return <CrudPage
        title="Courses"
        endpoint="/courses"
        searchable={true}
        fields={[
            { key: 'title', label: 'Title', showInTable: true, editable: true, placeholder: 'Course Title' },
            { key: 'description', label: 'Description', type: 'textarea', showInTable: false, editable: true, placeholder: 'Course description...' },
            {
                key: 'category', label: 'Category', showInTable: true, editable: true, type: 'select', options: [
                    { value: 'Robotics', label: 'Robotics' },
                    { value: 'Programming', label: 'Programming' },
                    { value: 'Electronics', label: 'Electronics' },
                    { value: 'AI & ML', label: 'AI & ML' },
                    { value: 'IoT', label: 'IoT' },
                ]
            },
            { key: 'ageGroup', label: 'Age Group', showInTable: true, editable: true, placeholder: '8-12 years' },
            {
                key: 'level', label: 'Level', showInTable: true, editable: true, type: 'select', options: [
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                ]
            },
            { key: 'price', label: 'Price (£)', type: 'number', showInTable: true, editable: true, default: 0 },
            { key: 'thumbnail', label: 'Thumbnail URL', showInTable: false, editable: true, placeholder: 'https://...' },
            { key: 'isLive', label: 'Is Live', type: 'switch', showInTable: true, editable: true, default: false },
            { key: 'startDate', label: 'Start Date', type: 'date', showInTable: false, editable: true },
            { key: 'endDate', label: 'End Date', type: 'date', showInTable: false, editable: true },
            {
                key: 'status', label: 'Status', showInTable: true, editable: true, type: 'select', options: [
                    { value: 'draft', label: 'Draft' },
                    { value: 'published', label: 'Published' },
                    { value: 'archived', label: 'Archived' },
                ], default: 'draft'
            },
            { key: 'enrollmentCount', label: 'Enrollments', showInTable: true, editable: false },
            { key: 'rating', label: 'Rating', showInTable: true, editable: false },
        ]}
    />;
}

export function AdminProducts() {
    return <CrudPage
        title="Products"
        endpoint="/products"
        searchable={true}
        fields={[
            { key: 'name', label: 'Product Name', showInTable: true, editable: true, placeholder: 'Product Name' },
            { key: 'description', label: 'Description', type: 'textarea', showInTable: false, editable: true, placeholder: 'Product description...' },
            {
                key: 'category', label: 'Category', showInTable: true, editable: true, type: 'select', options: [
                    { value: 'Robotics', label: 'Robotics' },
                    { value: 'Electronics', label: 'Electronics' },
                    { value: 'Arduino', label: 'Arduino' },
                    { value: 'Sensors', label: 'Sensors' },
                    { value: 'Kits', label: 'Kits' },
                    { value: 'Accessories', label: 'Accessories' },
                ]
            },
            { key: 'ageGroup', label: 'Age Group', showInTable: true, editable: true, placeholder: '8+ years' },
            { key: 'price', label: 'Price (£)', type: 'number', showInTable: true, editable: true, default: 0 },
            { key: 'stock', label: 'Stock', type: 'number', showInTable: true, editable: true, default: 0 },
            { key: 'images', label: 'Image URLs (comma-separated)', type: 'textarea', showInTable: false, editable: true, placeholder: 'https://image1.jpg, https://image2.jpg' },
            {
                key: 'status', label: 'Status', showInTable: true, editable: true, type: 'select', options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'out_of_stock', label: 'Out of Stock' },
                ], default: 'active'
            },
            { key: 'rating', label: 'Rating', showInTable: true, editable: false },
            { key: 'reviewsCount', label: 'Reviews', showInTable: true, editable: false },
        ]}
    />;
}

export function AdminOrders() {
    return <CrudPage title="Orders" endpoint="/orders" fields={[
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
    ]} />;
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
    return <CrudPage title="Enrollments" endpoint="/enrollments" searchable={false} fields={[
        { key: 'id', label: 'ID', showInTable: true, editable: false },
        { key: 'progressPercentage', label: 'Progress %', showInTable: true, editable: false },
        { key: 'status', label: 'Status', showInTable: true, editable: false },
        { key: 'certificateIssued', label: 'Certificate', type: 'switch', showInTable: true, editable: false },
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
            ]
        },
        { key: 'label', label: 'Display Label' },
    ]} />;
}
