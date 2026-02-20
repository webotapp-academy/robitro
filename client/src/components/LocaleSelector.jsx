import { useState, useEffect } from 'react';
import { Globe, X } from 'lucide-react';

const LocaleSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState('en');
    const [currency, setCurrency] = useState('USD');

    // Mock Languages/Currencies for selector
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ja', name: 'Japanese' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ru', name: 'Russian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'it', name: 'Italian' }
    ];

    const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CNY', 'CAD', 'AUD', 'BRL', 'RUB'];

    // Handle outside click to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.locale-selector-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative locale-selector-container">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? 'bg-blue-100 text-robitro-blue' : 'bg-blue-50 hover:bg-blue-100 text-robitro-blue'}`}
                title="Language & Currency Settings"
            >
                <Globe className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 w-[20rem] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-5 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 text-lg">Locale Settings</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full p-1 hover:bg-gray-100">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Languages</label>
                            <div className="relative">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-robitro-blue focus:ring-2 focus:ring-blue-50 appearance-none cursor-pointer hover:border-blue-300 transition-colors"
                                >
                                    {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Currency</label>
                            <p className="text-xs text-gray-500 mb-2">Your account will be fixed to the currency you choose when ordering.</p>
                            <div className="relative">
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-robitro-blue focus:ring-2 focus:ring-blue-50 appearance-none cursor-pointer hover:border-blue-300 transition-colors"
                                >
                                    {currencies.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3 bg-robitro-blue text-white rounded-xl font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-2"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocaleSelector;
