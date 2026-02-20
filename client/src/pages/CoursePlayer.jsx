import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronRight,
    Play, FileText, ImageIcon, Type, Lock, Trophy, BarChart3,
    BookOpen, Clock, Loader2, Menu, X
} from 'lucide-react';
import api from '../services/api';

export default function CoursePlayer() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Current active lesson
    const [activeChapter, setActiveChapter] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);

    // Expanded chapters in sidebar
    const [expandedChapters, setExpandedChapters] = useState({});

    // Completed lessons set (lessonId strings like "0-0", "0-1", "1-2")
    const [completedSet, setCompletedSet] = useState(new Set());

    // Mobile sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Marking in progress
    const [marking, setMarking] = useState(false);

    // ===== FETCH DATA =====
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            // 1. Get the course details
            const courseRes = await api.get(`/courses/${courseId}`);
            const courseData = courseRes.data.course;
            setCourse(courseData);

            // 2. Get user enrollment for this course
            const enrollRes = await api.get('/enrollments/my-courses');
            const courses = enrollRes.data.courses || [];
            const myEnrollment = courses.find(c => c.id === courseId);

            if (!myEnrollment) {
                setError('You are not enrolled in this course.');
                setLoading(false);
                return;
            }

            setEnrollment(myEnrollment);

            // Build completed set from completedLessons
            const completed = new Set();
            if (myEnrollment.completedLessons) {
                myEnrollment.completedLessons.forEach(cl => {
                    completed.add(cl.lessonId);
                });
            }
            setCompletedSet(completed);

            // Expand first chapter
            setExpandedChapters({ 0: true });

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ===== CURRICULUM =====
    const curriculum = course?.metadata?.curriculum || [];

    const totalLessons = curriculum.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0);
    const completedCount = completedSet.size;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const currentChapter = curriculum[activeChapter];
    const currentLesson = currentChapter?.lessons?.[activeLesson];

    // ===== LESSON ID =====
    const getLessonId = (chIdx, lIdx) => `${chIdx}-${lIdx}`;
    const isLessonCompleted = (chIdx, lIdx) => completedSet.has(getLessonId(chIdx, lIdx));

    // ===== MARK COMPLETE =====
    const markComplete = async () => {
        if (!enrollment) return;
        const lessonId = getLessonId(activeChapter, activeLesson);
        if (completedSet.has(lessonId)) return; // already done

        try {
            setMarking(true);
            await api.post('/enrollments/progress/complete-lesson', {
                enrollmentId: enrollment.enrollmentId,
                lessonId,
            });

            // Update local state
            setCompletedSet(prev => {
                const next = new Set(prev);
                next.add(lessonId);
                return next;
            });

            // Auto-advance to next lesson
            autoAdvance();
        } catch (err) {
            console.error('Failed to mark lesson complete', err);
        } finally {
            setMarking(false);
        }
    };

    // ===== AUTO ADVANCE =====
    const autoAdvance = () => {
        if (!currentChapter) return;
        const lessons = currentChapter.lessons || [];

        if (activeLesson < lessons.length - 1) {
            // Next lesson in same chapter
            setActiveLesson(activeLesson + 1);
        } else if (activeChapter < curriculum.length - 1) {
            // Next chapter
            const nextCh = activeChapter + 1;
            setActiveChapter(nextCh);
            setActiveLesson(0);
            setExpandedChapters(prev => ({ ...prev, [nextCh]: true }));
        }
    };

    // ===== NAV =====
    const goToLesson = (chIdx, lIdx) => {
        setActiveChapter(chIdx);
        setActiveLesson(lIdx);
        setExpandedChapters(prev => ({ ...prev, [chIdx]: true }));
        setSidebarOpen(false);
    };

    const toggleChapter = (idx) => {
        setExpandedChapters(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    // ===== CONTENT TYPE ICON =====
    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return <Play size={14} />;
            case 'pdf': return <FileText size={14} />;
            case 'image': return <ImageIcon size={14} />;
            default: return <Type size={14} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'video': return 'bg-red-500';
            case 'pdf': return 'bg-blue-500';
            case 'image': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    // ===== RENDER CONTENT =====
    const renderContent = () => {
        if (!currentLesson) {
            return (
                <div className="flex items-center justify-center h-full min-h-[400px] text-center">
                    <div>
                        <BookOpen size={64} className="mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No lesson selected</h3>
                        <p className="text-gray-400">Pick a lesson from the sidebar to begin.</p>
                    </div>
                </div>
            );
        }

        const { type, content, title } = currentLesson;

        switch (type) {
            case 'video': {
                // Extract YouTube video ID
                const ytMatch = content?.match(/(?:youtu\.be\/|v=|embed\/)([\w-]+)/);
                if (ytMatch) {
                    return (
                        <div className="space-y-4">
                            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                                <iframe
                                    src={`https://www.youtube.com/embed/${ytMatch[1]}?rel=0`}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="bg-gray-100 rounded-2xl p-8 text-center">
                        <Play size={48} className="mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-500">Video URL: <a href={content} target="_blank" rel="noreferrer" className="text-robitro-blue underline">{content}</a></p>
                    </div>
                );
            }

            case 'pdf': {
                return (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl overflow-hidden">
                            <div className="p-4 bg-blue-100 flex items-center gap-3">
                                <FileText size={20} className="text-blue-600" />
                                <span className="font-semibold text-blue-800">PDF Document</span>
                                <a href={content} target="_blank" rel="noreferrer" className="ml-auto text-sm font-bold text-blue-600 hover:underline">
                                    Open in new tab ↗
                                </a>
                            </div>
                            <iframe
                                src={content}
                                className="w-full border-0"
                                style={{ height: '70vh' }}
                                title={title}
                            />
                        </div>
                    </div>
                );
            }

            case 'image': {
                return (
                    <div className="space-y-4">
                        <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 p-4">
                            <img
                                src={content}
                                alt={title}
                                className="max-w-full mx-auto rounded-xl shadow-lg"
                                style={{ maxHeight: '70vh', objectFit: 'contain' }}
                            />
                        </div>
                    </div>
                );
            }

            case 'writeup':
            default: {
                return (
                    <div className="prose prose-lg max-w-none">
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                            {content?.split('\n').map((paragraph, i) => (
                                paragraph.trim() ? <p key={i} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p> : null
                            ))}
                        </div>
                    </div>
                );
            }
        }
    };

    // ===== LOADING =====
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4 text-robitro-blue" />
                    <p className="text-gray-500 font-medium">Loading course...</p>
                </div>
            </div>
        );
    }

    // ===== ERROR =====
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Lock size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Link to="/courses" className="bg-robitro-blue text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    // ===== CHAPTER PROGRESS =====
    const getChapterProgress = (chIdx) => {
        const lessons = curriculum[chIdx]?.lessons || [];
        if (lessons.length === 0) return 0;
        const done = lessons.filter((_, lIdx) => isLessonCompleted(chIdx, lIdx)).length;
        return Math.round((done / lessons.length) * 100);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* ============ SIDEBAR ============ */}
            {/* Desktop */}
            <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-200 shrink-0">
                <SidebarContent
                    course={course}
                    curriculum={curriculum}
                    expandedChapters={expandedChapters}
                    toggleChapter={toggleChapter}
                    goToLesson={goToLesson}
                    activeChapter={activeChapter}
                    activeLesson={activeLesson}
                    isLessonCompleted={isLessonCompleted}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
                    getChapterProgress={getChapterProgress}
                    progressPercent={progressPercent}
                    completedCount={completedCount}
                    totalLessons={totalLessons}
                    navigate={navigate}
                />
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="font-bold text-robitro-navy">Course Content</span>
                            <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <SidebarContent
                            course={course}
                            curriculum={curriculum}
                            expandedChapters={expandedChapters}
                            toggleChapter={toggleChapter}
                            goToLesson={goToLesson}
                            activeChapter={activeChapter}
                            activeLesson={activeLesson}
                            isLessonCompleted={isLessonCompleted}
                            getTypeIcon={getTypeIcon}
                            getTypeColor={getTypeColor}
                            getChapterProgress={getChapterProgress}
                            progressPercent={progressPercent}
                            completedCount={completedCount}
                            totalLessons={totalLessons}
                            navigate={navigate}
                        />
                    </aside>
                </div>
            )}

            {/* ============ MAIN CONTENT ============ */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                            <Menu size={20} />
                        </button>
                        <button onClick={() => navigate('/lms/dashboard')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-bold text-robitro-navy truncate max-w-[300px] lg:max-w-[500px]">{course?.title}</h1>
                            <p className="text-xs text-gray-400">{completedCount} of {totalLessons} lessons completed</p>
                        </div>
                    </div>

                    {/* Progress mini */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${progressPercent === 100 ? 'bg-green-500' : 'bg-robitro-blue'}`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-gray-500">{progressPercent}%</span>
                        </div>
                        {progressPercent === 100 && (
                            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                <Trophy size={12} /> Complete!
                            </span>
                        )}
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-8">

                        {/* Lesson Title */}
                        {currentLesson && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                    <span>Chapter {activeChapter + 1}</span>
                                    <ChevronRight size={12} />
                                    <span>Lesson {activeLesson + 1}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${getTypeColor(currentLesson.type)} flex items-center justify-center text-white`}>
                                        {getTypeIcon(currentLesson.type)}
                                    </div>
                                    <h2 className="text-2xl font-black text-robitro-navy">{currentLesson.title}</h2>
                                </div>
                            </div>
                        )}

                        {/* Lesson Content */}
                        {renderContent()}

                        {/* Action Bar */}
                        {currentLesson && (
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    {isLessonCompleted(activeChapter, activeLesson) ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle2 size={20} />
                                            <span className="font-bold text-sm">Lesson Completed ✓</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={markComplete}
                                            disabled={marking}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-robitro-blue to-robitro-teal text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
                                        >
                                            {marking ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                            Mark as Complete
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {/* Previous */}
                                    {(activeChapter > 0 || activeLesson > 0) && (
                                        <button
                                            onClick={() => {
                                                if (activeLesson > 0) {
                                                    setActiveLesson(activeLesson - 1);
                                                } else {
                                                    const prevChIdx = activeChapter - 1;
                                                    const prevLessons = curriculum[prevChIdx]?.lessons || [];
                                                    setActiveChapter(prevChIdx);
                                                    setActiveLesson(Math.max(0, prevLessons.length - 1));
                                                    setExpandedChapters(prev => ({ ...prev, [prevChIdx]: true }));
                                                }
                                            }}
                                            className="px-5 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            ← Previous
                                        </button>
                                    )}
                                    {/* Next */}
                                    {(activeChapter < curriculum.length - 1 || activeLesson < (currentChapter?.lessons?.length || 0) - 1) && (
                                        <button
                                            onClick={autoAdvance}
                                            className="px-5 py-3 bg-robitro-blue text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                        >
                                            Next →
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

// ===== SIDEBAR COMPONENT =====
function SidebarContent({
    course, curriculum, expandedChapters, toggleChapter, goToLesson,
    activeChapter, activeLesson, isLessonCompleted, getTypeIcon, getTypeColor,
    getChapterProgress, progressPercent, completedCount, totalLessons, navigate
}) {
    return (
        <div className="flex flex-col h-full">
            {/* Course Info */}
            <div className="p-5 border-b border-gray-100">
                <button onClick={() => navigate('/lms/dashboard')} className="text-xs text-robitro-blue font-semibold hover:underline mb-3 flex items-center gap-1">
                    <ArrowLeft size={12} /> Back to Dashboard
                </button>
                <h2 className="text-sm font-black text-robitro-navy line-clamp-2 mb-3">{course?.title}</h2>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-500">Progress</span>
                        <span className="text-xs font-bold text-robitro-blue">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${progressPercent === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-robitro-blue to-robitro-teal'}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-[11px] text-gray-400">{completedCount} / {totalLessons} lessons</p>
                </div>
            </div>

            {/* Chapters */}
            <nav className="flex-1 overflow-y-auto py-2">
                {curriculum.map((chapter, chIdx) => {
                    const chProgress = getChapterProgress(chIdx);
                    const isExpanded = expandedChapters[chIdx];
                    const lessons = chapter.lessons || [];

                    return (
                        <div key={chIdx} className="border-b border-gray-50">
                            {/* Chapter Header */}
                            <button
                                onClick={() => toggleChapter(chIdx)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${chProgress === 100 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {chProgress === 100 ? <CheckCircle2 size={14} /> : chIdx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-robitro-navy truncate">{chapter.title || `Chapter ${chIdx + 1}`}</p>
                                    <p className="text-[10px] text-gray-400">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''} • {chProgress}%</p>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Lessons */}
                            {isExpanded && (
                                <div className="pb-2">
                                    {lessons.map((lesson, lIdx) => {
                                        const isActive = activeChapter === chIdx && activeLesson === lIdx;
                                        const isDone = isLessonCompleted(chIdx, lIdx);

                                        return (
                                            <button
                                                key={lIdx}
                                                onClick={() => goToLesson(chIdx, lIdx)}
                                                className={`w-full flex items-center gap-3 pl-8 pr-4 py-2.5 text-left transition-all ${isActive
                                                        ? 'bg-robitro-blue/10 border-l-3 border-robitro-blue'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                {/* Status */}
                                                {isDone ? (
                                                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                                ) : (
                                                    <Circle size={16} className={`shrink-0 ${isActive ? 'text-robitro-blue' : 'text-gray-300'}`} />
                                                )}

                                                {/* Type Badge */}
                                                <div className={`w-5 h-5 rounded ${getTypeColor(lesson.type)} flex items-center justify-center text-white shrink-0`}>
                                                    {getTypeIcon(lesson.type)}
                                                </div>

                                                {/* Title */}
                                                <span className={`text-xs truncate ${isActive ? 'font-bold text-robitro-blue' : isDone ? 'text-gray-400 line-through' : 'text-gray-600'
                                                    }`}>
                                                    {lesson.title || `Lesson ${lIdx + 1}`}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Course Stats */}
            {progressPercent === 100 && (
                <div className="p-4 border-t border-gray-100 bg-green-50">
                    <div className="flex items-center gap-3">
                        <Trophy size={24} className="text-green-600" />
                        <div>
                            <p className="text-sm font-bold text-green-800">Course Completed! 🎉</p>
                            <p className="text-[11px] text-green-600">Congratulations on finishing the course!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
