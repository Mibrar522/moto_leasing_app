import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
};

const AdsManager = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState(emptyAdForm);
    const [uploading, setUploading] = useState(false);

    const loadAds = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/admin/ads');
            setAds(data.ads || []);
        } catch (err) {
            setMessage('Failed to load campaigns.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAds();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('adImage', file);

        try {
            setUploading(true);
            const { data } = await API.post('/admin/ads/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm((prev) => ({ ...prev, image_url: data.imageUrl }));
            setMessage('Image uploaded successfully.');
        } catch (err) {
            setMessage('Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setMessage('Saving campaign...');
            if (form.id) {
                await API.put(`/admin/ads/${form.id}`, form);
                setMessage('Campaign updated.');
            } else {
                await API.post('/admin/ads', form);
                setMessage('Campaign created.');
            }
            setForm(emptyAdForm);
            loadAds();
        } catch (err) {
            setMessage('Failed to save campaign.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this campaign?')) return;
        try {
            await API.delete(`/admin/ads/${id}`);
            setMessage('Campaign deleted.');
            loadAds();
        } catch (err) {
            setMessage('Delete failed.');
        }
    };

    const activeAdsCount = useMemo(() => ads.filter((a) => a.is_active).length, [ads]);

    return (
        <div className="ads-container notranslate">
            <header className="ads-header">
                <div>
                    <h2>Mobile Ad Studio</h2>
                    <p>Create vehicle campaigns on web and push them into the mobile app slider with image, name, and description.</p>
                </div>
                <Link className="ads-back" to="/dashboard">Back to Dashboard</Link>
            </header>

            {message ? <div className="ads-banner">{message}</div> : null}

            <section className="ads-studio">
                <form className="ads-form" onSubmit={handleSave}>
                    <h3>{form.id ? 'Edit Campaign' : 'Create New Campaign'}</h3>
                    
                    <div className="ads-input-row">
                        <div className="ads-field">
                            <label>Campaign Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Honda CD70 Offer" 
                                value={form.title} 
                                onChange={(e) => setForm({...form, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="ads-field">
                            <label>Subtitle / Slogan</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Save 10% on installments" 
                                value={form.subtitle} 
                                onChange={(e) => setForm({...form, subtitle: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="ads-field">
                        <label>Image Upload</label>
                        <div className="ads-upload-area">
                            <input type="file" onChange={handleFileChange} />
                            {uploading && <span className="ads-uploading">Uploading...</span>}
                        </div>
                        {form.image_url && (
                            <div className="ads-preview-small">
                                <img src={buildAssetUrl(form.image_url)} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className="ads-input-row">
                        <div className="ads-field">
                            <label>CTA Button Label</label>
                            <input 
                                type="text" 
                                placeholder="e.g. View Details" 
                                value={form.cta_label} 
                                onChange={(e) => setForm({...form, cta_label: e.target.value})}
                            />
                        </div>
                        <div className="ads-field">
                            <label>Order</label>
                            <input 
                                type="number" 
                                value={form.display_order} 
                                onChange={(e) => setForm({...form, display_order: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="ads-form-actions">
                        <button type="submit" className="ads-btn-save" disabled={uploading}>
                            {form.id ? 'Update Campaign' : 'Launch Campaign'}
                        </button>
                        {form.id && (
                            <button type="button" className="ads-btn-cancel" onClick={() => setForm(emptyAdForm)}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>

                <div className="ads-stats">
                    <div className="ads-stat-card">
                        <span className="ads-stat-val">{ads.length}</span>
                        <span className="ads-stat-lbl">Total Campaigns</span>
                    </div>
                    <div className="ads-stat-card">
                        <span className="ads-stat-val">{activeAdsCount}</span>
                        <span className="ads-stat-lbl">Live on Mobile</span>
                    </div>
                </div>
            </section>

            <section className="ads-grid-wrap">
                <h3>Managed Campaigns</h3>
                {loading ? <p>Loading...</p> : (
                    <div className="ads-grid">
                        {ads.map((ad) => (
                            <div key={ad.id} className={`ad-card ${!ad.is_active ? 'ad-card-paused' : ''}`}>
                                <div className="ad-card-img">
                                    <img src={buildAssetUrl(ad.image_url)} alt={ad.title} />
                                </div>
                                <div className="ad-card-body">
                                    <h4>{ad.title}</h4>
                                    <p>{ad.subtitle}</p>
                                    <div className="ad-card-actions">
                                        <button onClick={() => setForm(ad)}>Edit</button>
                                        <button onClick={() => handleDelete(ad.id)}>Delete</button>
                                        <button onClick={async () => {
                                            await API.put(`/admin/ads/${ad.id}`, { ...ad, is_active: !ad.is_active });
                                            loadAds();
                                        }}>
                                            {ad.is_active ? 'Pause' : 'Resume'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdsManager;