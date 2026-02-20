import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, BookOpen, Info, Tag, Eye, Image, Video, FileText, Type, X, ChevronDown, ChevronUp, GripVertical, Upload, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminCourseForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');
    const [expandedChapters, setExpandedChapters] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/admin/course-categories');
                if (res.data.success) setCategories(res.data.data);
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        fetchCategories();
    }, []);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        categoryId: '',
        level: 'beginner',
        ageGroup: '',
        price: 0,
        thumbnail: '',
        isLive: false,
        startDate: '',
        endDate: '',
        status: 'draft',
        metadata: {
            curriculum: [],
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isEdit) {
                    const res = await api.get(`/courses/${id}`);
                    if (res.data.success) {
                        const course = res.data.course;
                        // Map modules from DB to curriculum format if no metadata curriculum exists
                        let curriculum = course.metadata?.curriculum || [];
                        if (curriculum.length === 0 && course.modules?.length > 0) {
                            curriculum = course.modules.map(mod => ({
                                title: mod.title,
                                lessons: (mod.lessons || []).map(l => ({
                                    type: 'video',
                                    title: l.title,
                                    content: l.videoUrl || '',
                                    duration: l.duration || 0,
                                }))
                            }));
                        }
                        setFormData({
                            title: course.title || '',
                            description: course.description || '',
                            category: course.category || '',
                            categoryId: course.categoryId || '',
                            level: course.level || 'beginner',
                            ageGroup: course.ageGroup || '',
                            price: course.price || 0,
                            thumbnail: course.thumbnail || '',
                            isLive: course.isLive || false,
                            startDate: course.startDate ? course.startDate.split('T')[0] : '',
                            endDate: course.endDate ? course.endDate.split('T')[0] : '',
                            status: course.status || 'draft',
                            metadata: {
                                ...course.metadata,
                                curriculum,
                            }
                        });
                        // Expand first chapter by default
                        if (curriculum.length > 0) {
                            setExpandedChapters({ 0: true });
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load course data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleMetadataChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            metadata: { ...prev.metadata, [key]: value }
        }));
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setUploading(true);
            const res = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                // Use the full URL returned by server
                // Construct absolute URL if relative (though my upload route returns full)
                let url = res.data.url;
                if (url.startsWith('/')) {
                    url = window.location.origin + url;
                }
                setFormData(prev => ({ ...prev, thumbnail: url }));
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };
    const addChapter = () => {
        const curriculum = [...(formData.metadata.curriculum || []), { title: '', lessons: [] }];
        handleMetadataChange('curriculum', curriculum);
        setExpandedChapters(prev => ({ ...prev, [curriculum.length - 1]: true }));
    };

    const updateChapter = (index, field, value) => {
        const updated = [...(formData.metadata.curriculum || [])];
        updated[index] = { ...updated[index], [field]: value };
        handleMetadataChange('curriculum', updated);
    };

    const removeChapter = (index) => {
        handleMetadataChange('curriculum', (formData.metadata.curriculum || []).filter((_, i) => i !== index));
    };

    const toggleChapter = (index) => {
        setExpandedChapters(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const addLesson = (chapterIdx) => {
        const updated = [...(formData.metadata.curriculum || [])];
        updated[chapterIdx] = {
            ...updated[chapterIdx],
            lessons: [...(updated[chapterIdx].lessons || []), { type: 'writeup', title: '', content: '' }]
        };
        handleMetadataChange('curriculum', updated);
        setExpandedChapters(prev => ({ ...prev, [chapterIdx]: true }));
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
        updated[chapterIdx] = {
            ...updated[chapterIdx],
            lessons: updated[chapterIdx].lessons.filter((_, i) => i !== lessonIdx)
        };
        handleMetadataChange('curriculum', updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = isEdit ? 'put' : 'post';
            const url = isEdit ? `/courses/${id}` : '/courses';
            const res = await api[method](url, formData);
            if (res.data.success) {
                alert(`Course ${isEdit ? 'updated' : 'created'} successfully!`);
                navigate('/admin/courses');
            }
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Failed to save course: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const totalLessons = (formData.metadata.curriculum || []).reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0);

    const sidebarSections = [
        { id: 'basic', label: 'Basic Info', icon: Info },
        { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-robitro-blue mb-4"></div>
                <p className="text-gray-500 font-medium">Loading course...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/courses')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-robitro-navy">{isEdit ? 'Edit Course' : 'Add Course'}</h1>
                        <p className="text-sm text-gray-400">
                            {isEdit ? `Editing: ${formData.title || 'Untitled'}` : 'Create a new course with curriculum'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isEdit && (
                        <a href={`/courses/${id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                            <Eye size={14} /> Preview
                        </a>
                    )}
                    <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-robitro-blue text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all">
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Sidebar Nav */}
                <div className="w-48 flex-shrink-0 hidden lg:block">
                    <div className="sticky top-4 space-y-1">
                        {sidebarSections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => {
                                    setActiveSection(section.id);
                                    document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === section.id ? 'bg-robitro-blue text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                <section.icon size={15} />
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-6 max-w-4xl">

                    {/* ==================== BASIC INFO ==================== */}
                    <div id="section-basic" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Info size={16} className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-robitro-navy">Basic Information</h2>
                                <p className="text-xs text-gray-400">Course details and settings</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter course title" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-robitro-blue focus:border-transparent" required />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the course..." rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-robitro-blue focus:border-transparent resize-y" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Icon (Emoji)</label>
                                    <input
                                        type="text"
                                        value={formData.metadata?.icon || ''}
                                        onChange={(e) => handleMetadataChange('icon', e.target.value)}
                                        placeholder="e.g. 🎓"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Color Gradient (Tailwind)</label>
                                    <input
                                        type="text"
                                        value={formData.metadata?.color || ''}
                                        onChange={(e) => handleMetadataChange('color', e.target.value)}
                                        placeholder="e.g. from-blue-500 to-indigo-600"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.categoryId || (categories.find(c => c.name === formData.category)?.id) || ''}
                                        onChange={(e) => {
                                            const selectedId = e.target.value;
                                            const selectedCat = categories.find(c => c.id === selectedId);
                                            setFormData(prev => ({
                                                ...prev,
                                                categoryId: selectedId,
                                                category: selectedCat ? selectedCat.name : ''
                                            }));
                                        }}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
                                    <select name="level" value={formData.level} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900">
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Age Group *</label>
                                    <input type="text" name="ageGroup" value={formData.ageGroup} onChange={handleInputChange} placeholder="e.g. 8-12 years" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price (£)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900">
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="isLive" checked={formData.isLive} onChange={handleInputChange} className="w-5 h-5 rounded border-gray-300 text-robitro-blue focus:ring-robitro-blue" />
                                        <span className="text-sm font-semibold text-gray-700">Is Live Course</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail URL</label>
                                <div className="flex gap-3">
                                    <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} placeholder="https://..." className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900" />

                                    <label className="cursor-pointer flex items-center justify-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors min-w-[50px]">
                                        {uploading ? <Loader2 size={20} className="animate-spin text-gray-500" /> : <Upload size={20} className="text-gray-600" />}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                                    </label>

                                    {formData.thumbnail && (
                                        <img src={formData.thumbnail} alt="Thumbnail" className="w-16 h-12 object-cover rounded-lg border border-gray-200" onError={(e) => e.target.style.display = 'none'} />
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Paste a URL or upload an image.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                                </div>
                            </div>
                        </div>
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
                                    <p className="text-xs text-gray-400">
                                        {(formData.metadata.curriculum || []).length} chapter{(formData.metadata.curriculum || []).length !== 1 ? 's' : ''} • {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <button type="button" onClick={addChapter} className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm">
                                <Plus size={14} /> Add Chapter
                            </button>
                        </div>

                        {(formData.metadata.curriculum || []).length === 0 ? (
                            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                                <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-bold text-gray-400 mb-2">No Chapters Yet</h3>
                                <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                                    Start building your course by adding chapters. Each chapter can contain videos, PDFs, images, and text writeups.
                                </p>
                                <button type="button" onClick={addChapter} className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
                                    <Plus size={16} /> Add Your First Chapter
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(formData.metadata.curriculum || []).map((chapter, chIdx) => (
                                    <div key={chIdx} className="border border-violet-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                                        {/* Chapter Header */}
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-violet-50 to-purple-50 p-4 cursor-pointer" onClick={() => toggleChapter(chIdx)}>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <GripVertical size={14} />
                                            </div>
                                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-violet-600 text-white rounded-lg text-sm font-bold shadow-sm">{chIdx + 1}</span>
                                            <input
                                                type="text"
                                                value={chapter.title}
                                                onChange={(e) => updateChapter(chIdx, 'title', e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                placeholder="Chapter Title (e.g. Introduction to Robotics)"
                                                className="flex-1 px-3 py-2 border border-violet-200 rounded-lg bg-white text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                                            />
                                            <span className="text-xs text-violet-500 font-medium px-2">{(chapter.lessons || []).length} lesson{(chapter.lessons || []).length !== 1 ? 's' : ''}</span>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); addLesson(chIdx); }} className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-semibold hover:bg-violet-700 transition-colors">
                                                <Plus size={12} /> Lesson
                                            </button>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); removeChapter(chIdx); }} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                            <div className={`transform transition-transform ${expandedChapters[chIdx] ? 'rotate-180' : ''}`}>
                                                <ChevronDown size={16} className="text-gray-400" />
                                            </div>
                                        </div>

                                        {/* Lessons - Collapsible */}
                                        {expandedChapters[chIdx] && (
                                            <div>
                                                {(chapter.lessons || []).length === 0 ? (
                                                    <div className="p-6 text-center">
                                                        <p className="text-sm text-gray-400 mb-3">No lessons in this chapter yet</p>
                                                        <button type="button" onClick={() => addLesson(chIdx)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">
                                                            <Plus size={12} /> Add Lesson
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-gray-100">
                                                        {(chapter.lessons || []).map((lesson, lIdx) => (
                                                            <div key={lIdx} className="p-4 group hover:bg-gray-50/50 transition-colors">
                                                                <div className="flex items-start gap-3">
                                                                    {/* Lesson Number & Type Icon */}
                                                                    <div className="flex flex-col items-center gap-1 pt-1">
                                                                        <span className="text-[10px] text-gray-400 font-bold">{lIdx + 1}</span>
                                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${lesson.type === 'video' ? 'bg-red-500' :
                                                                            lesson.type === 'pdf' ? 'bg-blue-500' :
                                                                                lesson.type === 'image' ? 'bg-green-500' : 'bg-gray-500'
                                                                            }`}>
                                                                            {lesson.type === 'video' ? <Video size={14} /> :
                                                                                lesson.type === 'pdf' ? <FileText size={14} /> :
                                                                                    lesson.type === 'image' ? <Image size={14} /> : <Type size={14} />}
                                                                        </div>
                                                                    </div>

                                                                    {/* Lesson Content */}
                                                                    <div className="flex-1 space-y-2">
                                                                        <div className="flex gap-2">
                                                                            <select
                                                                                value={lesson.type}
                                                                                onChange={(e) => updateLesson(chIdx, lIdx, 'type', e.target.value)}
                                                                                className="px-2.5 py-2 border border-gray-200 rounded-lg bg-white text-xs text-slate-900 font-medium w-32"
                                                                            >
                                                                                <option value="writeup">📝 Writeup</option>
                                                                                <option value="video">🎬 Video (YouTube)</option>
                                                                                <option value="pdf">📄 PDF</option>
                                                                                <option value="image">🖼️ Image</option>
                                                                            </select>
                                                                            <input
                                                                                type="text"
                                                                                value={lesson.title}
                                                                                onChange={(e) => updateLesson(chIdx, lIdx, 'title', e.target.value)}
                                                                                placeholder="Lesson Title"
                                                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-slate-900 focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                                                                            />
                                                                        </div>

                                                                        {lesson.type === 'video' && (
                                                                            <div className="space-y-1">
                                                                                <input type="text" value={lesson.content || ''} onChange={(e) => updateLesson(chIdx, lIdx, 'content', e.target.value)} placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs text-slate-900" />
                                                                                {lesson.content && lesson.content.match(/(?:youtu\.be\/|v=)([\w-]+)/) && (
                                                                                    <div className="aspect-video rounded-lg overflow-hidden max-w-xs border border-gray-200">
                                                                                        <iframe src={`https://www.youtube.com/embed/${lesson.content.match(/(?:youtu\.be\/|v=)([\w-]+)/)[1]}`} className="w-full h-full" allowFullScreen title={lesson.title} />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        {lesson.type === 'pdf' && (
                                                                            <input type="text" value={lesson.content || ''} onChange={(e) => updateLesson(chIdx, lIdx, 'content', e.target.value)} placeholder="PDF URL (upload and paste link here)" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs text-slate-900" />
                                                                        )}
                                                                        {lesson.type === 'image' && (
                                                                            <div className="space-y-1">
                                                                                <input type="text" value={lesson.content || ''} onChange={(e) => updateLesson(chIdx, lIdx, 'content', e.target.value)} placeholder="Image URL (upload and paste link here)" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs text-slate-900" />
                                                                                {lesson.content && (
                                                                                    <img src={lesson.content} alt={lesson.title} className="max-h-32 rounded-lg border border-gray-200 object-cover" onError={(e) => e.target.style.display = 'none'} />
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        {lesson.type === 'writeup' && (
                                                                            <textarea value={lesson.content || ''} onChange={(e) => updateLesson(chIdx, lIdx, 'content', e.target.value)} placeholder="Write your content here... Supports multiple paragraphs." rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs text-slate-900 resize-y" />
                                                                        )}
                                                                    </div>

                                                                    {/* Delete Lesson */}
                                                                    <button type="button" onClick={() => removeLesson(chIdx, lIdx)} className="mt-2 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50">
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* Add more lessons button */}
                                                        <div className="p-3 border-t border-gray-100">
                                                            <button type="button" onClick={() => addLesson(chIdx)} className="w-full flex items-center justify-center gap-1.5 py-2 text-violet-600 hover:bg-violet-50 rounded-lg text-xs font-semibold transition-colors">
                                                                <Plus size={12} /> Add Another Lesson
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Save */}
                    <div className="flex items-center justify-end gap-3 pb-8">
                        <button type="button" onClick={() => navigate('/admin/courses')} className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-2.5 bg-robitro-blue text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all">
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
