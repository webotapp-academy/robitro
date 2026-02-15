import { useState, useEffect } from 'react';
import api from '../services/api';

export default function LegalPage({ settingKey, title }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await api.get(`/cms/settings/${settingKey}`);
                if (response.data.success) {
                    setContent(response.data.data.value);
                }
            } catch (error) {
                console.error(`Error fetching ${settingKey}:`, error);
                setContent('Content not found. Please manage it from the admin panel.');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [settingKey]);

    return (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                    <h1 className="text-4xl font-black text-robitro-navy mb-8 border-b border-gray-100 pb-6">
                        {title}
                    </h1>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-robitro-yellow border-t-robitro-blue mb-4"></div>
                            <p className="text-gray-500 font-medium">Loading content...</p>
                        </div>
                    ) : (
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                            {content}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
