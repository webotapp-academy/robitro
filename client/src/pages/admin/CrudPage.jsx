import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X, Save, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

async function apiFetch(url, options = {}) {
    const res = await api({
        url: `/admin${url}`,
        ...options,
        data: options.body ? JSON.parse(options.body) : undefined
    });
    return res.data;
}

export default function CrudPage({ title, endpoint, fields, searchable = true }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [error, setError] = useState('');

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 20 });
            if (search) params.append('search', search);
            const data = await apiFetch(`${endpoint}?${params}`);
            setItems(data.data || []);
            setPagination(data.pagination || null);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }, [endpoint, page, search]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleCreate = () => {
        const initial = {};
        fields.forEach(f => { initial[f.key] = f.default ?? ''; });
        setFormData(initial);
        setEditItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        const data = {};
        fields.forEach(f => { data[f.key] = item[f.key] ?? f.default ?? ''; });
        setFormData(data);
        setEditItem(item);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
            fetchItems();
        } catch (err) { setError(err.message); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const processedData = { ...formData };
            fields.forEach(f => {
                if (f.type === 'number' && processedData[f.key] !== '') processedData[f.key] = Number(processedData[f.key]);
                if (f.type === 'switch') processedData[f.key] = Boolean(processedData[f.key]);
            });

            if (editItem) {
                await apiFetch(`${endpoint}/${editItem.id}`, { method: 'PUT', body: JSON.stringify(processedData) });
            } else {
                await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(processedData) });
            }
            setShowForm(false);
            fetchItems();
        } catch (err) { setError(err.message); }
        setSaving(false);
    };

    const renderField = (field) => {
        const value = formData[field.key] ?? '';

        if (field.type === 'textarea') {
            return <textarea value={value} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-robitro-navy focus:ring-2 focus:ring-robitro-blue/20 focus:border-robitro-blue outline-none resize-none" />;
        }
        if (field.type === 'select') {
            return (
                <select value={value} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-robitro-navy focus:ring-2 focus:ring-robitro-blue/20 focus:border-robitro-blue outline-none bg-white">
                    {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            );
        }
        if (field.type === 'switch') {
            return (
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={!!value} onChange={e => setFormData({ ...formData, [field.key]: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-robitro-blue"></div>
                </label>
            );
        }
        return <input type={field.type || 'text'} value={value} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-robitro-navy focus:ring-2 focus:ring-robitro-blue/20 focus:border-robitro-blue outline-none" placeholder={field.placeholder || ''} />;
    };

    const displayFields = fields.filter(f => f.showInTable !== false);

    return (
        <div>
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex justify-between items-center">
                    {error}
                    <button onClick={() => setError('')}><X size={16} /></button>
                </div>
            )}

            {/* Header bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-robitro-navy">{title}</h2>
                    <p className="text-sm text-robitro-gray">{items.length} {pagination ? `of ${pagination.total}` : ''} items</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {searchable && (
                        <div className="relative flex-1 sm:flex-initial">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-robitro-navy w-full sm:w-64 focus:ring-2 focus:ring-robitro-blue/20 focus:border-robitro-blue outline-none"
                            />
                        </div>
                    )}
                    <button onClick={handleCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-robitro-blue to-robitro-teal text-white !text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap">
                        <Plus size={16} /> Add New
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {displayFields.map(f => (
                                    <th key={f.key} className="text-left px-5 py-3.5 text-xs font-bold text-robitro-gray uppercase tracking-wider">{f.label}</th>
                                ))}
                                <th className="text-right px-5 py-3.5 text-xs font-bold text-robitro-gray uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={displayFields.length + 1} className="text-center py-12">
                                    <Loader2 size={24} className="animate-spin mx-auto text-robitro-blue" />
                                </td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan={displayFields.length + 1} className="text-center py-12 text-robitro-gray">No items found</td></tr>
                            ) : items.map(item => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    {displayFields.map(f => (
                                        <td key={f.key} className="px-5 py-3.5 text-robitro-navy font-medium max-w-[200px] truncate">
                                            {f.render ? f.render(item[f.key], item) : (
                                                f.type === 'switch' ? (
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${item[f.key] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {item[f.key] ? 'Active' : 'Inactive'}
                                                    </span>
                                                ) : String(item[f.key] ?? '—')
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-2 text-robitro-blue hover:bg-robitro-blue/10 rounded-lg transition-colors"><Edit2 size={15} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                        <p className="text-xs text-robitro-gray">Page {pagination.page} of {pagination.pages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={14} /></button>
                            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={14} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center rounded-t-2xl">
                            <h3 className="text-lg font-bold text-robitro-navy">{editItem ? 'Edit' : 'Create'} {title.replace(/s$/, '')}</h3>
                            <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {fields.filter(f => f.editable !== false).map(f => (
                                <div key={f.key}>
                                    <label className="block text-xs font-bold text-robitro-gray uppercase tracking-wider mb-1.5">{f.label}</label>
                                    {renderField(f)}
                                </div>
                            ))}
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-robitro-blue to-robitro-teal text-white !text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {editItem ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 bg-gray-100 text-robitro-gray font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
