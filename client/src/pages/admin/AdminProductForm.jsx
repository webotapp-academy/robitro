import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Plus, Trash2, GripVertical, Star, Package, Tag, Layers, Award, BookOpen, Users, Sparkles, Image, Info, ChevronDown, ChevronUp, Eye, Shield, FileText, Video, Type } from 'lucide-react';
import api from '../../services/api';

export default function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeSection, setActiveSection] = useState('basic');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        ageGroup: '',
        stock: 0,
        categoryId: '',
        categoryName: '',
        status: 'active',
        images: [],
        rating: 0,
        reviewsCount: 0,
        specifications: {},
        warranty: {},
        metadata: {
            tagline: '',
            originalPrice: 0,
            features: [],
            skills: [],
            projects: [],
            reviews_list: [],
            freeCourse: null,
            whyBuyFromUs: [],
            curriculum: [],
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await api.get('/admin/product-categories');
                if (catRes.data.success) {
                    setCategories(catRes.data.data);
                }

                if (isEdit) {
                    const prodRes = await api.get(`/products/${id}`);
                    if (prodRes.data.success) {
                        const product = prodRes.data.product;
                        setFormData({
                            ...product,
                            categoryId: product.categoryId || '',
                            categoryName: product.categoryName || '',
                            rating: product.rating || 0,
                            reviewsCount: product.reviewsCount || 0,
                            metadata: {
                                tagline: product.metadata?.tagline || '',
                                originalPrice: product.metadata?.originalPrice || 0,
                                features: product.metadata?.features || [],
                                skills: product.metadata?.skills || [],
                                projects: product.metadata?.projects || [],
                                reviews_list: product.metadata?.reviews_list || [],
                                freeCourse: product.metadata?.freeCourse || null,
                                whyBuyFromUs: product.metadata?.whyBuyFromUs || [],
                                curriculum: product.metadata?.curriculum || [],
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleMetadataChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [field]: value
            }
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setSaving(true);
            const res = await api.post('/admin/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                let url = res.data.url;
                if (url.startsWith('/')) {
                    url = window.location.origin + url;
                }
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, url]
                }));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Image upload failed');
        } finally {
            setSaving(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // ========== FEATURES ==========
    const addFeature = () => {
        handleMetadataChange('features', [...(formData.metadata.features || []), '']);
    };
    const updateFeature = (index, value) => {
        const updated = [...(formData.metadata.features || [])];
        updated[index] = value;
        handleMetadataChange('features', updated);
    };
    const removeFeature = (index) => {
        handleMetadataChange('features', (formData.metadata.features || []).filter((_, i) => i !== index));
    };

    // ========== SKILLS ==========
    const addSkill = () => {
        handleMetadataChange('skills', [...(formData.metadata.skills || []), { name: '', icon: '🤖', quote: '' }]);
    };
    const updateSkill = (index, field, value) => {
        const updated = [...(formData.metadata.skills || [])];
        updated[index] = { ...updated[index], [field]: value };
        handleMetadataChange('skills', updated);
    };
    const removeSkill = (index) => {
        handleMetadataChange('skills', (formData.metadata.skills || []).filter((_, i) => i !== index));
    };

    // ========== PROJECTS ==========
    const addProject = () => {
        handleMetadataChange('projects', [...(formData.metadata.projects || []), { name: '', description: '', image: '' }]);
    };
    const updateProject = (index, field, value) => {
        const updated = [...(formData.metadata.projects || [])];
        updated[index] = { ...updated[index], [field]: value };
        handleMetadataChange('projects', updated);
    };
    const removeProject = (index) => {
        handleMetadataChange('projects', (formData.metadata.projects || []).filter((_, i) => i !== index));
    };

    // ========== REVIEWS ==========
    const addReview = () => {
        handleMetadataChange('reviews_list', [...(formData.metadata.reviews_list || []), { name: '', location: '', rating: 5, text: '', date: '', verified: true }]);
    };
    const updateReview = (index, field, value) => {
        const updated = [...(formData.metadata.reviews_list || [])];
        updated[index] = { ...updated[index], [field]: value };
        handleMetadataChange('reviews_list', updated);
    };
    const removeReview = (index) => {
        handleMetadataChange('reviews_list', (formData.metadata.reviews_list || []).filter((_, i) => i !== index));
    };

    // ========== FREE COURSE ==========
    const toggleFreeCourse = () => {
        if (formData.metadata.freeCourse) {
            handleMetadataChange('freeCourse', null);
        } else {
            handleMetadataChange('freeCourse', { name: '', value: 0 });
        }
    };
    const updateFreeCourse = (field, value) => {
        handleMetadataChange('freeCourse', { ...formData.metadata.freeCourse, [field]: value });
    };

    // ========== WHY BUY FROM US ==========
    const addTrustBadge = () => {
        handleMetadataChange('whyBuyFromUs', [...(formData.metadata.whyBuyFromUs || []), { icon: '🛡️', title: '', description: '' }]);
    };
    const updateTrustBadge = (index, field, value) => {
        const updated = [...(formData.metadata.whyBuyFromUs || [])];
        updated[index] = { ...updated[index], [field]: value };
        handleMetadataChange('whyBuyFromUs', updated);
    };
    const removeTrustBadge = (index) => {
        handleMetadataChange('whyBuyFromUs', (formData.metadata.whyBuyFromUs || []).filter((_, i) => i !== index));
    };

    // ========== CURRICULUM ==========
    const addChapter = () => {
        handleMetadataChange('curriculum', [...(formData.metadata.curriculum || []), { title: '', lessons: [] }]);
    };
    const updateChapter = (index, field, value) => {
        const updated = [...(formData.metadata.curriculum || [])];
        updated[index] = { ...updated[index], [field]: value };
        handleMetadataChange('curriculum', updated);
    };
    const removeChapter = (index) => {
        handleMetadataChange('curriculum', (formData.metadata.curriculum || []).filter((_, i) => i !== index));
    };
    const addLesson = (chapterIdx) => {
        const updated = [...(formData.metadata.curriculum || [])];
        updated[chapterIdx] = { ...updated[chapterIdx], lessons: [...(updated[chapterIdx].lessons || []), { type: 'writeup', title: '', content: '' }] };
        handleMetadataChange('curriculum', updated);
    };
    const updateLesson = (chapterIdx, lessonIdx, field, value) => {
        const updated = [...(formData.metadata.curriculum || [])];
        const lessons = [...(updated[chapterIdx].lessons || [])];
        lessons[lessonIdx] = { ...lessons[lessonIdx], [field]: value };
        updated[chapterIdx] = { ...updated[chapterIdx], lessons };
        handleMetadataChange('curriculum', updated);
    };
    const removeLesson = (chapterIdx, lessonIdx) => {
        const updated = [...(formData.metadata.curriculum || [])];
        updated[chapterIdx] = { ...updated[chapterIdx], lessons: updated[chapterIdx].lessons.filter((_, i) => i !== lessonIdx) };
        handleMetadataChange('curriculum', updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = isEdit ? 'put' : 'post';
            const url = isEdit ? `/admin/products/${id}` : '/admin/products';

            const res = await api[method](url, formData);
            if (res.data.success) {
                alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
                navigate('/admin/products');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const discount = formData.metadata.originalPrice > 0 && formData.price > 0
        ? Math.round((1 - formData.price / formData.metadata.originalPrice) * 100)
        : 0;

    const sidebarSections = [
        { id: 'basic', label: 'Basic Info', icon: Info },
        { id: 'images', label: 'Images', icon: Image },
        { id: 'pricing', label: 'Pricing & Stock', icon: Tag },
        { id: 'features', label: 'Features', icon: Layers },
        { id: 'skills', label: 'Skills', icon: Award },
        { id: 'projects', label: 'Projects', icon: Package },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'trustbadges', label: 'Why Buy From Us', icon: Shield },
        { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
        { id: 'freecourse', label: 'Free Course', icon: BookOpen },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-3 border-robitro-blue mb-4"></div>
                <p className="text-gray-500 font-medium">Loading product...</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {/* ====== HEADER ====== */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-robitro-navy">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Fill in all the details to match the product page</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isEdit && (
                        <a
                            href={`/shop/${id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            <Eye size={16} />
                            Preview
                        </a>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-robitro-blue text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>

            <div className="flex gap-6">
                {/* ====== SECTION NAV (Left Sidebar) ====== */}
                <div className="hidden lg:block w-56 flex-shrink-0">
                    <div className="sticky top-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-1">
                        {sidebarSections.map(section => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        setActiveSection(section.id);
                                        document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === section.id
                                        ? 'bg-robitro-blue text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-robitro-navy'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ====== MAIN FORM ====== */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-6 min-w-0">

                    {/* ==================== BASIC INFORMATION ==================== */}
                    <div id="section-basic" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Info size={16} className="text-robitro-blue" />
                            </div>
                            <h2 className="text-lg font-bold text-robitro-navy">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Robitro MEX DIY Robotics Advanced Kit 2.0"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                />
                            </div>

                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={formData.metadata.tagline || ''}
                                    onChange={(e) => handleMetadataChange('tagline', e.target.value)}
                                    placeholder="e.g. Master Robotics, Coding & AI"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Shown as a subtitle on the product page</p>
                            </div>

                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    placeholder="Describe your product in detail..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none resize-y"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        const selectedCat = categories.find(c => c.id === selectedId);
                                        setFormData(prev => ({
                                            ...prev,
                                            categoryId: selectedId,
                                            categoryName: selectedCat ? selectedCat.name : ''
                                        }));
                                    }}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                                <input
                                    type="text"
                                    name="ageGroup"
                                    value={formData.ageGroup}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 10+ Ages"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="discontinued">Discontinued</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ==================== PRODUCT IMAGES ==================== */}
                    <div id="section-images" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                <Image size={16} className="text-purple-600" />
                            </div>
                            <h2 className="text-lg font-bold text-robitro-navy">Product Images</h2>
                            <span className="text-xs text-gray-400 ml-auto">{formData.images.length} image(s)</span>
                        </div>

                        <div className="space-y-4">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 relative">
                                    {img ? (
                                        <img src={img} alt="Product" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                            <Image size={24} />
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        value={img}
                                        placeholder="Image URL"
                                        onChange={(e) => {
                                            const newImages = [...formData.images];
                                            newImages[idx] = e.target.value;
                                            setFormData(prev => ({ ...prev, images: newImages }));
                                        }}
                                        className="flex-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    {idx === 0 && (
                                        <span className="absolute -top-2 -left-2 px-2 py-0.5 bg-robitro-blue text-white text-[10px] font-bold rounded-md shadow-sm">MAIN</span>
                                    )}
                                </div>
                            ))}

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))}
                                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm"
                                >
                                    + Add Image URL
                                </button>
                                <label className="cursor-pointer flex items-center justify-center px-4 py-2.5 bg-robitro-blue hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors text-sm">
                                    {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Upload size={16} className="mr-2" />}
                                    Upload Image
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={saving} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ==================== PRICING & STOCK ==================== */}
                    <div id="section-pricing" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                <Tag size={16} className="text-green-600" />
                            </div>
                            <h2 className="text-lg font-bold text-robitro-navy">Pricing & Stock</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (£) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    step="0.01"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">The actual selling price</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">M.R.P. (£)</label>
                                <input
                                    type="number"
                                    value={formData.metadata.originalPrice || 0}
                                    onChange={(e) => handleMetadataChange('originalPrice', parseFloat(e.target.value) || 0)}
                                    step="0.01"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Original / compare price</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                                <div className={`px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 font-semibold ${discount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                    {discount > 0 ? `${discount}% off` : 'No discount'}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Auto-calculated</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                />
                            </div>
                        </div>

                        {/* Rating Preview */}
                        <div className="mt-5 pt-5 border-t border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                        />
                                        <div className="flex text-yellow-400 text-lg">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span key={star} className={star <= Math.floor(formData.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
                                    <input
                                        type="number"
                                        name="reviewsCount"
                                        value={formData.reviewsCount}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Price Preview Card */}
                        {formData.price > 0 && (
                            <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Price Preview (as shown on frontend)</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-black text-robitro-navy">£ {formData.price.toLocaleString('en-GB')} /-</span>
                                </div>
                                {formData.metadata.originalPrice > formData.price && (
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-sm text-gray-500">M.R.P.:</span>
                                        <span className="text-sm text-gray-500 line-through">£ {formData.metadata.originalPrice.toLocaleString('en-GB')} /-</span>
                                        <span className="text-sm text-green-600 font-bold">{discount}% off</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ==================== FEATURES (What You Get) ==================== */}
                    <div id="section-features" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <Layers size={16} className="text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-robitro-navy">Features</h2>
                                    <p className="text-xs text-gray-400">Shown in "What You Get" section</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-colors"
                            >
                                <Plus size={14} /> Add Feature
                            </button>
                        </div>

                        {(formData.metadata.features || []).length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Layers size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No features added yet</p>
                                <p className="text-xs">Click "Add Feature" to add product highlights</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(formData.metadata.features || []).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 group">
                                        <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-orange-50 text-orange-600 rounded-full text-xs font-bold">
                                            {idx + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(idx, e.target.value)}
                                            placeholder="e.g. 300+ parts including building blocks, motors, sensors..."
                                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-robitro-blue/20 text-slate-900 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(idx)}
                                            className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ==================== SKILLS ==================== */}
                    <div id="section-skills" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <Award size={16} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-robitro-navy">Skills You'll Learn</h2>
                                    <p className="text-xs text-gray-400">Displayed in the colorful skills section</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addSkill}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
                            >
                                <Plus size={14} /> Add Skill
                            </button>
                        </div>

                        {(formData.metadata.skills || []).length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Award size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No skills added yet</p>
                                <p className="text-xs">Add skills like Robotics, AI, Coding, etc.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(formData.metadata.skills || []).map((skill, idx) => (
                                    <div key={idx} className="relative p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 group">
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(idx)}
                                            className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="flex items-center gap-3 mb-3">
                                            <input
                                                type="text"
                                                value={skill.icon}
                                                onChange={(e) => updateSkill(idx, 'icon', e.target.value)}
                                                className="w-12 h-12 text-center text-2xl border border-indigo-200 rounded-lg bg-white"
                                                placeholder="🤖"
                                            />
                                            <input
                                                type="text"
                                                value={skill.name}
                                                onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                                                placeholder="Skill Name"
                                                className="flex-1 px-3 py-2 border border-indigo-200 rounded-lg bg-white text-sm font-semibold"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={skill.quote || ''}
                                            onChange={(e) => updateSkill(idx, 'quote', e.target.value)}
                                            placeholder="Inspirational quote (optional)"
                                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg bg-white text-xs italic"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ==================== PROJECTS ==================== */}
                    <div id="section-projects" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <Package size={16} className="text-teal-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-robitro-navy">Projects You Can Build</h2>
                                    <p className="text-xs text-gray-400">Showcase buildable projects with images</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addProject}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-sm font-semibold hover:bg-teal-100 transition-colors"
                            >
                                <Plus size={14} /> Add Project
                            </button>
                        </div>

                        {(formData.metadata.projects || []).length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Package size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No projects added yet</p>
                                <p className="text-xs">Add projects like Line Follower, Robotic Arm, etc.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(formData.metadata.projects || []).map((project, idx) => (
                                    <div key={idx} className="relative flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                                        <button
                                            type="button"
                                            onClick={() => removeProject(idx)}
                                            className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                        {project.image ? (
                                            <img src={project.image} alt={project.name} className="w-20 h-20 flex-shrink-0 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                                                <Image size={20} />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                value={project.name}
                                                onChange={(e) => updateProject(idx, 'name', e.target.value)}
                                                placeholder="Project Name"
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm font-semibold"
                                            />
                                            <input
                                                type="text"
                                                value={project.description}
                                                onChange={(e) => updateProject(idx, 'description', e.target.value)}
                                                placeholder="Short description"
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs"
                                            />
                                            <input
                                                type="text"
                                                value={project.image}
                                                onChange={(e) => updateProject(idx, 'image', e.target.value)}
                                                placeholder="Image URL"
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs text-gray-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ==================== REVIEWS ==================== */}
                    <div id="section-reviews" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                                    <Star size={16} className="text-yellow-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-robitro-navy">Customer Reviews</h2>
                                    <p className="text-xs text-gray-400">Add testimonials displayed on the product page</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addReview}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-semibold hover:bg-yellow-100 transition-colors"
                            >
                                <Plus size={14} /> Add Review
                            </button>
                        </div>

                        {(formData.metadata.reviews_list || []).length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Star size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No reviews added yet</p>
                                <p className="text-xs">Add customer testimonials to build trust</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(formData.metadata.reviews_list || []).map((review, idx) => (
                                    <div key={idx} className="relative p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                                        <button
                                            type="button"
                                            onClick={() => removeReview(idx)}
                                            className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                            <input
                                                type="text"
                                                value={review.name}
                                                onChange={(e) => updateReview(idx, 'name', e.target.value)}
                                                placeholder="Reviewer Name"
                                                className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={review.location}
                                                onChange={(e) => updateReview(idx, 'location', e.target.value)}
                                                placeholder="Location (e.g. London)"
                                                className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Rating:</span>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => updateReview(idx, 'rating', star)}
                                                            className={`text-lg ${star <= (review.rating || 0) ? 'text-yellow-400' : 'text-gray-200'} hover:text-yellow-400 transition-colors`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <textarea
                                            value={review.text}
                                            onChange={(e) => updateReview(idx, 'text', e.target.value)}
                                            placeholder="Review text..."
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm mb-2 resize-y"
                                        />

                                        <div className="flex items-center gap-4">
                                            <input
                                                type="text"
                                                value={review.date}
                                                onChange={(e) => updateReview(idx, 'date', e.target.value)}
                                                placeholder="e.g. 2 weeks ago"
                                                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs w-40"
                                            />
                                            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={review.verified || false}
                                                    onChange={(e) => updateReview(idx, 'verified', e.target.checked)}
                                                    className="rounded border-gray-300 text-green-600"
                                                />
                                                Verified Purchase
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ==================== FREE COURSE ==================== */}
                    <div id="section-freecourse" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <BookOpen size={16} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-robitro-navy">Free Course Offer</h2>
                                    <p className="text-xs text-gray-400">Banner shown on product page</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={toggleFreeCourse}
                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${formData.metadata.freeCourse
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                    }`}
                            >
                                {formData.metadata.freeCourse ? 'Remove Offer' : 'Add Offer'}
                            </button>
                        </div>

                        {formData.metadata.freeCourse ? (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-1">Course Name</label>
                                        <input
                                            type="text"
                                            value={formData.metadata.freeCourse.name}
                                            onChange={(e) => updateFreeCourse('name', e.target.value)}
                                            placeholder="e.g. Robotics Fundamentals Course"
                                            className="w-full px-3 py-2 border border-green-200 rounded-lg bg-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-1">Course Value (£)</label>
                                        <input
                                            type="number"
                                            value={formData.metadata.freeCourse.value}
                                            onChange={(e) => updateFreeCourse('value', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-green-200 rounded-lg bg-white text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-white/60 rounded-lg border border-green-200/60">
                                    <p className="text-xs font-semibold text-green-700 mb-1">Preview:</p>
                                    <p className="text-sm text-green-700">
                                        🎁 Unlock a <span className="font-bold">£ {(formData.metadata.freeCourse.value || 0).toLocaleString('en-GB')} /-</span> course FREE only with this kit!
                                    </p>
                                    <p className="text-xs text-green-600">{formData.metadata.freeCourse.name || 'Course name...'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No free course offer configured</p>
                                <p className="text-xs">Click "Add Offer" to include a free course with this product</p>
                            </div>
                        )}
                    </div>

                    {/* ==================== WHY BUY FROM US ==================== */}
                    <div id="section-trustbadges" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                                    <Shield size={16} className="text-sky-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-robitro-navy">Why Buy From Us</h2>
                                    <p className="text-xs text-gray-400">Trust badges shown on the product page</p>
                                </div>
                            </div>
                            <button type="button" onClick={addTrustBadge} className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg text-sm font-semibold hover:bg-sky-100 transition-colors">
                                <Plus size={14} /> Add Badge
                            </button>
                        </div>
                        {(formData.metadata.whyBuyFromUs || []).length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Shield size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No trust badges added yet</p>
                                <p className="text-xs">Add badges like Free Shipping, Warranty, Expert Support</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(formData.metadata.whyBuyFromUs || []).map((badge, idx) => (
                                    <div key={idx} className="relative flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                        <button type="button" onClick={() => removeTrustBadge(idx)} className="absolute top-1 right-1 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                                        <input type="text" value={badge.icon} onChange={(e) => updateTrustBadge(idx, 'icon', e.target.value)} className="w-10 h-10 text-center text-xl border border-gray-200 rounded-lg bg-white" placeholder="🛡️" />
                                        <div className="flex-1 space-y-1">
                                            <input type="text" value={badge.title} onChange={(e) => updateTrustBadge(idx, 'title', e.target.value)} placeholder="Badge Title" className="w-full px-2 py-1 border border-gray-200 rounded-lg bg-white text-sm font-semibold" />
                                            <input type="text" value={badge.description} onChange={(e) => updateTrustBadge(idx, 'description', e.target.value)} placeholder="Short description" className="w-full px-2 py-1 border border-gray-200 rounded-lg bg-white text-xs" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ==================== COURSE CURRICULUM ==================== */}
                    <div id="section-curriculum" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <BookOpen size={16} className="text-violet-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-robitro-navy">Course Curriculum</h2>
                                    <p className="text-xs text-gray-400">Chapters with videos, PDFs, images & writeups</p>
                                </div>
                            </div>
                            <button type="button" onClick={addChapter} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-sm font-semibold hover:bg-violet-100 transition-colors">
                                <Plus size={14} /> Add Chapter
                            </button>
                        </div>

                        {(formData.metadata.curriculum || []).length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No chapters added yet</p>
                                <p className="text-xs">Create chapters and add lessons (videos, PDFs, images, writeups)</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(formData.metadata.curriculum || []).map((chapter, chIdx) => (
                                    <div key={chIdx} className="border border-violet-200 rounded-xl overflow-hidden">
                                        {/* Chapter Header */}
                                        <div className="flex items-center gap-3 bg-violet-50 p-4">
                                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-violet-600 text-white rounded-lg text-sm font-bold">{chIdx + 1}</span>
                                            <input type="text" value={chapter.title} onChange={(e) => updateChapter(chIdx, 'title', e.target.value)} placeholder="Chapter Title" className="flex-1 px-3 py-2 border border-violet-200 rounded-lg bg-white text-sm font-semibold" />
                                            <button type="button" onClick={() => addLesson(chIdx)} className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-semibold hover:bg-violet-700 transition-colors"><Plus size={12} /> Lesson</button>
                                            <button type="button" onClick={() => removeChapter(chIdx)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                        </div>

                                        {/* Lessons */}
                                        {(chapter.lessons || []).length === 0 ? (
                                            <div className="p-4 text-center text-gray-400 text-xs">No lessons yet. Click "+ Lesson" to add content.</div>
                                        ) : (
                                            <div className="divide-y divide-gray-100">
                                                {(chapter.lessons || []).map((lesson, lIdx) => (
                                                    <div key={lIdx} className="p-4 group hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-start gap-3">
                                                            {/* Lesson Type Icon */}
                                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white ${lesson.type === 'video' ? 'bg-red-500' :
                                                                lesson.type === 'pdf' ? 'bg-blue-500' :
                                                                    lesson.type === 'image' ? 'bg-green-500' : 'bg-gray-500'
                                                                }`}>
                                                                {lesson.type === 'video' ? <Video size={14} /> :
                                                                    lesson.type === 'pdf' ? <FileText size={14} /> :
                                                                        lesson.type === 'image' ? <Image size={14} /> : <Type size={14} />}
                                                            </div>

                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex gap-2">
                                                                    <select value={lesson.type} onChange={(e) => updateLesson(chIdx, lIdx, 'type', e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-medium w-28">
                                                                        <option value="writeup">📝 Writeup</option>
                                                                        <option value="video">🎬 Video</option>
                                                                        <option value="pdf">📄 PDF</option>
                                                                        <option value="image">🖼️ Image</option>
                                                                    </select>
                                                                    <input type="text" value={lesson.title} onChange={(e) => updateLesson(chIdx, lIdx, 'title', e.target.value)} placeholder="Lesson Title" className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm" />
                                                                </div>

                                                                {lesson.type === 'video' && (
                                                                    <input type="text" value={lesson.content || ''} onChange={(e) => updateLesson(chIdx, lIdx, 'content', e.target.value)} placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs text-gray-600" />
                                                                )}
                                                                {lesson.type === 'pdf' && (
                                                                    <input type="text" value={lesson.content || ''} onChange={(e) => updateLesson(chIdx, lIdx, 'content', e.target.value)} placeholder="PDF URL (upload and paste link here)" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs text-gray-600" />
                                                                )}
                                                                {lesson.type === 'image' && (
                                                                    <input type="text" value={lesson.content || ''} onChange={(e) => updateLesson(chIdx, lIdx, 'content', e.target.value)} placeholder="Image URL (upload and paste link here)" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs text-gray-600" />
                                                                )}
                                                                {lesson.type === 'writeup' && (
                                                                    <textarea value={lesson.content || ''} onChange={(e) => updateLesson(chIdx, lIdx, 'content', e.target.value)} placeholder="Write your content here..." rows={3} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs resize-y" />
                                                                )}
                                                            </div>

                                                            <button type="button" onClick={() => removeLesson(chIdx, lIdx)} className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Save */}
                    <div className="flex items-center justify-end gap-3 pb-8">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-2.5 bg-robitro-blue text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
