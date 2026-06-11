import React, { useState } from 'react';

export default function AdminAirportForm({ onSubmit, loading }) {
    const [airportCode, setAirportCode] = useState('');
    const [airportName, setAirportName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');
    const [uploadType, setUploadType] = useState('file'); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrlInput, setImageUrlInput] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('airport_code', airportCode.trim().toUpperCase());
        formData.append('airport_name', airportName.trim());
        formData.append('city', city.trim());
        formData.append('country', country.trim());
        formData.append('description', description.trim());

        if (uploadType === 'file') {
            if (!selectedFile) {
                alert('חובה לבחור קובץ תמונה מהמחשב!');
                return;
            }
            formData.append('image', selectedFile);
        } else {
            if (!imageUrlInput.trim()) {
                alert('חובה להזין כתובת URL של תמונה!');
                return;
            }
            formData.append('image_url', imageUrlInput.trim());
        }

        onSubmit(formData, () => {
            setAirportCode('');
            setAirportName('');
            setCity('');
            setCountry('');
            setDescription('');
            setSelectedFile(null);
            setImageUrlInput('');
            e.target.reset();
        });
    };

    return (
        <section className="form-section-compact">
            <h4>➕ הוספת שדה תעופה חדש</h4>
            <form onSubmit={handleFormSubmit} className="airport-compact-form" encType="multipart/form-data">
                <div className="compact-grid">
                    <div className="form-group-compact">
                        <label>קוד שדה</label>
                        <input type="text" maxLength="3" value={airportCode} onChange={(e) => setAirportCode(e.target.value)} required placeholder="for example JFK" />
                    </div>
                    <div className="form-group-compact">
                        <label>שם נמל התעופה</label>
                        <input type="text" value={airportName} onChange={(e) => setAirportName(e.target.value)} required placeholder="נמל תעופה" />
                    </div>
                    <div className="form-group-compact">
                        <label>עיר</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="עיר" />
                    </div>
                    <div className="form-group-compact">
                        <label>מדינה</label>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="מדינה" />
                    </div>
                    <div className="form-group-compact">
                        <label>תיאור</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="תיאור קצר..." />
                    </div>
                    
                    {/* בחירת שיטת העלאה דחוסה */}
                    <div className="form-group-compact upload-selector-wrapper">
                        <label>שיטת תמונה</label>
                        <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="compact-select">
                            <option value="file">📁 קובץ מחשב</option>
                            <option value="url">🌐 קישור URL</option>
                        </select>
                    </div>

                    <div className="form-group-compact file-input-wide">
                        {uploadType === 'file' ? (
                            <>
                                <label>בחרי קובץ</label>
                                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} required className="form-file-input-compact" />
                            </>
                        ) : (
                            <>
                                <label>כתובת URL תמונה</label>
                                <input type="url" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="https://..." required />
                            </>
                        )}
                    </div>

                    <div className="form-group-compact btn-container-compact">
                        <button type="submit" className="submit-btn-compact" disabled={loading}>
                            {loading ? 'שומר...' : '🚀 הוסף שדה'}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}