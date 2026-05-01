import React, { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import './AdsManager.css';

const buildAssetUrl = (rawUrl) => {
    if (!rawUrl) return '';
    const base = String(API.defaults.baseURL || '').replace(/\/api\/v1\/?$/, '');
    if (rawUrl.startsWith('http')) return rawUrl;
    return `${base}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
};

const emptyAdForm = {
    id: '',
    title: '',
    subtitle: '',
    image_url: '',
    cta_label: '',
    cta_url: '',
    display_order: 0,
    is_active: true,
    start_at: '',
    end_at: '',
    dealer_id: '',
};

const AdsManager = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState(emptyAdForm);

    const resetForm = () => setForm(emptyAdForm);

    const loadAds = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/admin/ads');
            setAds(data.ads || []);
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Failed to load ads.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAds();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEdit = (ad) => {
        setForm({
            id: ad.id || '',
            title: ad.title || '',
            subtitle: ad.subtitle || '',
            image_url: ad.image_url || '',
            cta_label: ad.cta_label || '',
            cta_url: ad.cta_url || '',
            display_order: ad.display_order ?? 0,
            is_active: Boolean(ad.is_active),
            start_at: ad.start_at ? ad.start_at.slice(0, 10) : '',
            end_at: ad.end_at ? ad.end_at.slice(0, 10) : '',
            dealer_id: ad.dealer_id || '',
        });
    };

    const handleDelete = async (adId) => {
        if (!window.confirm('Delete this advertisement?')) return;
        setLoading(true);
        try {
            await API.delete(`/admin/ads/${adId}`);
            setMessage('Ad deleted.');
            await loadAds();
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Failed to delete ad.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const payload = {
                title: form.title,
                subtitle: form.subtitle,
                image_url: form.image_url,
                cta_label: form.cta_label,
                cta_url: form.cta_url,
                display_order: Number(form.display_order || 0),
                is_active: Boolean(form.is_active),
                start_at: form.start_at || null,
                end_at: form.end_at || null,
                dealer_id: form.dealer_id || null,
            };
            if (form.id) {
                await API.put(`/admin/ads/${form.id}`, payload);
                setMessage('Ad updated.');
            } else {
                await API.post('/admin/ads', payload);
                setMessage('Ad created.');
            }
            resetForm();
            await loadAds();
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Failed to save ad.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('adImage', file);
        setLoading(true);
        try {
            const { data } = await API.post('/admin/ads/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm((prev) => ({ ...prev, image_url: data.url || '' }));
            setMessage('Image uploaded.');
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Failed to upload image.');
        } finally {
            setLoading(false);
        }
    };

    const previewUrl = useMemo(() => {
        return buildAssetUrl(form.image_url);
    }, [form.image_url]);

    return (
        <div className="ads-manager">
            <header className="ads-header">
                <div>
                    <h2>Mobile Ad Studio</h2>
                    <p>Create vehicle campaigns on web and push them into the mobile app slider with image, name, and description.</p>
                </div>
                <a className="ads-back" href="#/app/dashboard">Back to Dashboard</a>
            </header>

            {message ? <div className="ads-banner">{message}</div> : null}

            <section className="ads-studio">
                <form className="ads-form" onSubmit={handleSubmit}>
                    <div className="ads-form-heading">
                        <div>
                            <h3>{form.id ? 'Edit Campaign' : 'Create Campaign'}</h3>
                            <p>Use the vehicle name and description exactly how you want them to appear in mobile.</p>
                        </div>
                        <span className={`ads-status ${form.is_active ? 'is-active' : 'is-draft'}`}>
                            {form.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="ads-grid">
                        <label>
                            Vehicle / Ad Name
                            <input name="title" value={form.title} onChange={handleChange} placeholder="Honda CD-70 Red 2026" />
                        </label>
                        <label>
                            CTA Button Label
                            <input name="cta_label" value={form.cta_label} onChange={handleChange} placeholder="View Offer" />
                        </label>
                        <label className="ads-span-2">
                            Description
                            <textarea
                                name="subtitle"
                                value={form.subtitle}
                                onChange={handleChange}
                                placeholder="Fresh stock, light monthly plan, dealer-approved delivery."
                                rows={4}
                            />
                        </label>
                        <label className="ads-span-2">
                            CTA URL
                            <input name="cta_url" value={form.cta_url} onChange={handleChange} placeholder="https://..." />
                        </label>
                        <label>
                            Slide Order
                            <input name="display_order" type="number" value={form.display_order} onChange={handleChange} />
                        </label>
                        <label>
                            Dealer ID (optional)
                            <input name="dealer_id" value={form.dealer_id} onChange={handleChange} placeholder="Leave empty for global" />
                        </label>
                        <label>
                            Start Date
                            <input name="start_at" type="date" value={form.start_at} onChange={handleChange} />
                        </label>
                        <label>
                            End Date
                            <input name="end_at" type="date" value={form.end_at} onChange={handleChange} />
                        </label>
                    </div>
                    <div className="ads-upload">
                        <label className="ads-upload-label">
                            Campaign Image
                            <input type="file" accept="image/*" onChange={handleUpload} />
                        </label>
                        <label className="ads-inline">
                            <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} />
                            Push to mobile
                        </label>
                    </div>
                    <div className="ads-actions">
                        <button type="button" onClick={resetForm} disabled={loading}>Reset</button>
                        <button type="submit" disabled={loading}>{loading ? 'Saving...' : form.id ? 'Update Campaign' : 'Publish Campaign'}</button>
                    </div>
                </form>

                <aside className="ads-phone-preview">
                    <div className="ads-phone-shell">
                        <div className="ads-phone-notch" />
                        <div className="ads-phone-screen">
                            <span className="ads-preview-kicker">Mobile Preview</span>
                            <div className="ads-mobile-slide">
                                <div className="ads-mobile-copy">
                                    <span className="ads-chip">Featured Vehicle</span>
                                    <h4>{form.title || 'Vehicle name will appear here'}</h4>
                                    <p>{form.subtitle || 'Short campaign description will appear here for the mobile slider.'}</p>
                                    <button type="button">{form.cta_label || 'View Offer'}</button>
                                </div>
                                <div className="ads-mobile-visual">
                                    {previewUrl ? (
                                        <img className="ads-preview" src={previewUrl} alt="Ad preview" />
                                    ) : (
                                        <div className="ads-preview-placeholder">Upload image</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <div className="ads-list">
                <h3>Campaign Library</h3>
                {ads.length === 0 ? <p className="ads-empty">No ads created yet.</p> : null}
                <div className="ads-cards">
                    {ads.map((ad) => (
                        <div key={ad.id} className="ads-card">
                            <div className="ads-card-copy">
                                {ad.image_url ? (
                                    <img
                                        className="ads-card-thumb"
                                        src={buildAssetUrl(ad.image_url)}
                                        alt={ad.title || 'Ad'}
                                    />
                                ) : null}
                                <div>
                                    <strong>{ad.title || 'Untitled ad'}</strong>
                                    <p>{ad.subtitle || 'No description'}</p>
                                    <span className="ads-card-meta">
                                        Order {ad.display_order ?? 0} • {ad.is_active ? 'Live on mobile' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="ads-card-actions">
                                <button type="button" onClick={() => handleEdit(ad)}>Edit</button>
                                <button type="button" onClick={() => handleDelete(ad.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdsManager;
