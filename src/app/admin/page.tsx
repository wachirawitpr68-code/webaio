"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../context/LanguageContext";
import { PROVINCES } from "../../data/provinces";
import ImageCropper from "../../components/ImageCropper";

type Tab = 'researchers' | 'news';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const [activeTab, setActiveTab] = useState<Tab>('researchers');
  const [loading, setLoading] = useState(false);
  // Cropper State
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [croppingTarget, setCroppingTarget] = useState<'researchers' | 'news'>('researchers');
  
  const handleStartCrop = (file: File, target: 'researchers' | 'news') => {
    const url = URL.createObjectURL(file);
    setImageToCrop(url);
    setCroppingTarget(target);
    setIsCropping(true);
  };
  const handleStartCropUrl = (url: string, target: 'researchers' | 'news') => {
    setImageToCrop(url);
    setCroppingTarget(target);
    setIsCropping(true);
  };

  
  const handleCropComplete = (croppedFile: File) => {
    if (croppingTarget === 'researchers') {
      setResFile(croppedFile);
      setResFormData(prev => ({...prev, image_url: ""}));
    } else {
      setNewsFile(croppedFile);
      setNewsFormData(prev => ({...prev, image_url: ""}));
    }
    setIsCropping(false);
    setImageToCrop("");
  };
  
  const handleCropCancel = () => {
    setIsCropping(false);
    setImageToCrop("");
  };


  // Researchers state
  const [researchers, setResearchers] = useState<any[]>([]);
  const [editingResId, setEditingResId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [resFormData, setResFormData] = useState({
    name_th: "", name_en: "", 
    position_th: "", position_en: "", 
    bio_th: "", bio_en: "", 
    scholar_link: "", image_url: "", university_th: "", university_en: "", province: "", email: ""
  });
  const [resFile, setResFile] = useState<File | null>(null);
  const resFileInputRef = useRef<HTMLInputElement>(null);

  // News state
  const [news, setNews] = useState<any[]>([]);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [newsFormData, setNewsFormData] = useState({
    title_th: "", title_en: "",
    content_th: "", content_en: "",
    image_url: ""
  });
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const newsFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === 'researchers') fetchResearchers();
      else if (activeTab === 'news') fetchNews();
    }
  }, [isLoggedIn, activeTab]);

  // Handle Paste Image anywhere on the page
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isLoggedIn) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleStartCrop(file, activeTab);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoggedIn, activeTab]);


  const fetchResearchers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('researchers').select('*').order('id', { ascending: true });
    if (data) setResearchers(data);
    setLoading(false);
  };

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('news').select('*').order('published_date', { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "aio12345678") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("รหัสผ่านไม่ถูกต้อง");
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image.');
    }
    
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- Researchers Handlers ---
  const handleSaveRes = async () => {
    if (!resFormData.name_th) return alert("กรุณาใส่ชื่อนักวิจัย (TH)");
    setLoading(true);
    try {
      let finalImageUrl = resFormData.image_url;
      if (resFile) {
        const url = await uploadFile(resFile);
        if (url) finalImageUrl = url;
      }

      const payload = { ...resFormData, image_url: finalImageUrl };

      if (editingResId) {
        const { error } = await supabase.from('researchers').update(payload).eq('id', editingResId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('researchers').insert([payload]);
        if (error) throw error;
      }
      await fetchResearchers();
      resetResForm();
      alert("บันทึกข้อมูลนักวิจัยสำเร็จ!");
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRes = async (id: number) => {
    if (confirm("ต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
      setLoading(true);
      const { error } = await supabase.from('researchers').delete().eq('id', id);
      if (!error) await fetchResearchers();
      else alert("เกิดข้อผิดพลาด: " + error.message);
      setLoading(false);
    }
  };

  const editResItem = (r: any) => {
    setEditingResId(r.id);
    setResFormData({
      name_th: r.name_th || r.name || "", name_en: r.name_en || "",
      position_th: r.position_th || r.position || "", position_en: r.position_en || "",
      bio_th: r.bio_th || r.bio || "", bio_en: r.bio_en || "",
      scholar_link: r.scholar_link || "", image_url: r.image_url || "", university_th: r.university_th || r.university || "", university_en: r.university_en || "", province: r.province || "", email: r.email || ""
    });
    setResFile(null);
  };

  const resetResForm = () => {
    setEditingResId(null);
    setResFormData({ name_th: "", name_en: "", position_th: "", position_en: "", bio_th: "", bio_en: "", scholar_link: "", image_url: "", university_th: "", university_en: "", province: "", email: "" });
    setResFile(null);
  };

  // --- News Handlers ---
  const handleSaveNews = async () => {
    if (!newsFormData.title_th) return alert("กรุณาใส่หัวข้อข่าว (TH)");
    setLoading(true);
    try {
      let finalImageUrl = newsFormData.image_url;
      if (newsFile) {
        const url = await uploadFile(newsFile);
        if (url) finalImageUrl = url;
      }

      const payload = { ...newsFormData, image_url: finalImageUrl };

      if (editingNewsId) {
        const { error } = await supabase.from('news').update(payload).eq('id', editingNewsId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('news').insert([payload]);
        if (error) throw error;
      }
      await fetchNews();
      resetNewsForm();
      alert("บันทึกข่าวสารสำเร็จ!");
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (confirm("ต้องการลบข่าวนี้ใช่หรือไม่?")) {
      setLoading(true);
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (!error) await fetchNews();
      else alert("เกิดข้อผิดพลาด: " + error.message);
      setLoading(false);
    }
  };

  const editNewsItem = (n: any) => {
    setEditingNewsId(n.id);
    setNewsFormData({
      title_th: n.title_th || n.title || "", title_en: n.title_en || "",
      content_th: n.content_th || n.content || "", content_en: n.content_en || "",
      image_url: n.image_url || ""
    });
    setNewsFile(null);
  };

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNewsFormData({ title_th: "", title_en: "", content_th: "", content_en: "", image_url: "" });
    setNewsFile(null);
  };


  const checkMissingFields = (r: any) => {
    const missing = [];
    if (!r.name_th && !r.name) missing.push("ชื่อ-นามสกุล (TH)");
    if (!r.name_en) missing.push("Name (EN)");
    if (!r.university_th && !r.university) missing.push("มหาวิทยาลัย (TH)");
    if (!r.university_en) missing.push("University (EN)");
    if (!r.province) missing.push("จังหวัด (Province)");
    if (!r.scholar_link) missing.push("ลิงก์ Google Scholar");
    if (!r.email) missing.push("อีเมล (Email)");
    return missing;
  };

  const { t } = useLanguage();

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '8rem 1rem', maxWidth: '600px', margin: '0 auto', minHeight: '70vh' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '3rem', textAlign: 'center', color: 'var(--color-primary)' }}>{t('admin.login.title')}</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--color-gray-50)', padding: '3.5rem', borderRadius: '16px', border: '1px solid var(--color-gray-200)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>{t('admin.login.password')}</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.login.placeholder')} 
                style={{ width: '100%', padding: '1.2rem', paddingRight: '3rem', border: '1px solid rgba(0, 243, 255, 0.3)', borderRadius: '8px', fontSize: '1.2rem', background: 'rgba(10, 15, 30, 0.7)', color: 'white' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>
          {error && <p style={{ color: 'red', fontSize: '1.1rem' }}>{error}</p>}
          <button type="submit" style={{ marginTop: '1rem', width: '100%', padding: '1.2rem', fontSize: '1.3rem', backgroundColor: 'var(--color-primary)', color: '#000', boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
            {t('admin.login.button')}
          </button>
        </form>
      </div>
    );
  }

  const renderFileUploader = (file: File | null, imageUrl: string, target: 'researchers' | 'news', fileInputRef: React.RefObject<HTMLInputElement | null>) => {
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleStartCrop(e.dataTransfer.files[0], target);
      }
    };
    
    return (
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '2px dashed rgba(0, 243, 255, 0.4)',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          background: 'rgba(10, 15, 30, 0.5)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'border-color 0.3s ease'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef}
          style={{ display: 'none' }} 
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleStartCrop(e.target.files[0], target);
              e.target.value = ''; // Reset input
            }
          }} 
        />
        {(file || imageUrl) ? (
          <div>
            <img 
              src={file ? URL.createObjectURL(file) : imageUrl} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', marginBottom: '1rem' }} 
            />
            {!file && imageUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartCropUrl(imageUrl, target);
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: '1px solid var(--color-primary)',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                ✂️ ครอปรูปเดิม
              </button>
            )}
            <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
              คลิกหรือลากไฟล์มาวางเพื่อเปลี่ยนรูปภาพ
            </p>
          </div>
        ) : (
          <div style={{ color: 'var(--color-secondary)' }}>
            <svg style={{ width: '40px', height: '40px', marginBottom: '1rem', color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>คลิก, ลากมาวาง หรือ กด Ctrl+V (วางรูป) ที่นี่</p>
            <p style={{ fontSize: '0.9rem' }}>รองรับไฟล์ JPG, PNG, GIF</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {isCropping && (
        <ImageCropper 
          imageSrc={imageToCrop} 
          onCropCompleteAction={handleCropComplete} 
          onCancel={handleCropCancel} 
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>Admin Dashboard</h1>
        <button onClick={() => setIsLoggedIn(false)} className="btn btn-danger">ออกจากระบบ</button>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', borderBottom: '2px solid var(--color-gray-200)' }}>
        <button 
          onClick={() => setActiveTab('researchers')} 
          style={{ padding: '1rem 2rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', borderBottom: activeTab === 'researchers' ? '4px solid var(--color-primary)' : '4px solid transparent', color: activeTab === 'researchers' ? 'var(--color-primary)' : 'var(--color-secondary)' }}
        >
          จัดการนักวิจัย
        </button>
        <button 
          onClick={() => setActiveTab('news')} 
          style={{ padding: '1rem 2rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', borderBottom: activeTab === 'news' ? '4px solid var(--color-primary)' : '4px solid transparent', color: activeTab === 'news' ? 'var(--color-primary)' : 'var(--color-secondary)' }}
        >
          จัดการข่าวสาร
        </button>
      </div>

      <div className="responsive-grid-admin">
        {/* Form */}
        <div style={{ background: 'rgba(10, 15, 30, 0.8)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '12px', alignSelf: 'start', border: '1px solid var(--color-gray-200)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            {activeTab === 'researchers' ? (editingResId ? "แก้ไขข้อมูลนักวิจัย" : "เพิ่มนักวิจัยใหม่") : (editingNewsId ? "แก้ไขข่าวสาร" : "เพิ่มข่าวสารใหม่")}
          </h2>
          
          {activeTab === 'researchers' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{display: 'flex', gap: '1rem'}}>
                <input type="text" placeholder="ชื่อ-นามสกุล (TH)" value={resFormData.name_th} onChange={e => setResFormData({...resFormData, name_th: e.target.value})} style={inputStyle} disabled={loading} />
                <input type="text" placeholder="Name (EN)" value={resFormData.name_en} onChange={e => setResFormData({...resFormData, name_en: e.target.value})} style={inputStyle} disabled={loading} />
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <input type="text" placeholder="ตำแหน่ง (TH)" value={resFormData.position_th} onChange={e => setResFormData({...resFormData, position_th: e.target.value})} style={inputStyle} disabled={loading} />
                <input type="text" placeholder="Position (EN)" value={resFormData.position_en} onChange={e => setResFormData({...resFormData, position_en: e.target.value})} style={inputStyle} disabled={loading} />
              </div>
              <textarea placeholder="ประวัติย่อ (TH)" rows={3} value={resFormData.bio_th} onChange={e => setResFormData({...resFormData, bio_th: e.target.value})} style={inputStyle} disabled={loading} />
              <textarea placeholder="Bio (EN)" rows={3} value={resFormData.bio_en} onChange={e => setResFormData({...resFormData, bio_en: e.target.value})} style={inputStyle} disabled={loading} />
              <div style={{display: 'flex', gap: '1rem'}}>
                <input type="text" placeholder="มหาวิทยาลัย (TH)" value={resFormData.university_th} onChange={e => setResFormData({...resFormData, university_th: e.target.value})} style={inputStyle} disabled={loading} />
                <input type="text" placeholder="University (EN)" value={resFormData.university_en} onChange={e => setResFormData({...resFormData, university_en: e.target.value})} style={inputStyle} disabled={loading} />
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  list="provinces-list" 
                  value={resFormData.province} 
                  onChange={e => setResFormData({...resFormData, province: e.target.value})} 
                  placeholder="พิมพ์ค้นหา หรือเลือกจังหวัด (Province)" 
                  style={inputStyle} 
                  disabled={loading} 
                />
                <datalist id="provinces-list">
                  {PROVINCES.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </datalist>
              </div>
              <input type="text" placeholder="ลิงก์ Google Scholar" value={resFormData.scholar_link} onChange={e => setResFormData({...resFormData, scholar_link: e.target.value})} style={inputStyle} disabled={loading} />
              <input type="email" placeholder="อีเมล (Email)" value={resFormData.email} onChange={e => setResFormData({...resFormData, email: e.target.value})} style={inputStyle} disabled={loading} />
              
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>รูปภาพนักวิจัย</label>
                {renderFileUploader(resFile, resFormData.image_url, 'researchers', resFileInputRef)}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleSaveRes} className="btn" style={{ flex: 1, backgroundColor: 'var(--color-primary)', color: '#000', boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold' }} disabled={loading}>
                  {loading ? "กำลังบันทึก..." : "บันทึก"}
                </button>
                {editingResId && <button onClick={resetResForm} className="btn" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold' }} disabled={loading}>ยกเลิก</button>}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="หัวข้อข่าว (TH)" value={newsFormData.title_th} onChange={e => setNewsFormData({...newsFormData, title_th: e.target.value})} style={inputStyle} disabled={loading} />
              <input type="text" placeholder="Title (EN)" value={newsFormData.title_en} onChange={e => setNewsFormData({...newsFormData, title_en: e.target.value})} style={inputStyle} disabled={loading} />
              <textarea placeholder="เนื้อหาข่าวสั้นๆ (TH)" rows={4} value={newsFormData.content_th} onChange={e => setNewsFormData({...newsFormData, content_th: e.target.value})} style={inputStyle} disabled={loading} />
              <textarea placeholder="Content (EN)" rows={4} value={newsFormData.content_en} onChange={e => setNewsFormData({...newsFormData, content_en: e.target.value})} style={inputStyle} disabled={loading} />
              
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>รูปภาพประกอบข่าวสาร</label>
                {renderFileUploader(newsFile, newsFormData.image_url, 'news', newsFileInputRef)}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleSaveNews} className="btn" style={{ flex: 1, backgroundColor: 'var(--color-primary)', color: '#000', boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold' }} disabled={loading}>
                  {loading ? "กำลังบันทึก..." : "บันทึก"}
                </button>
                {editingNewsId && <button onClick={resetNewsForm} className="btn" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold' }} disabled={loading}>ยกเลิก</button>}
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            {activeTab === 'researchers' ? 'รายชื่อผู้วิจัยทั้งหมด' : 'รายการข่าวสารทั้งหมด'}
          </h2>
          {activeTab === 'researchers' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="🔍 ค้นหาชื่อนักวิจัย (ไทย/อังกฤษ)..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 2.5rem',
                  border: '1px solid rgba(0, 243, 255, 0.5)',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  background: 'rgba(10, 15, 30, 0.8)',
                  color: '#fff',
                  boxShadow: '0 0 10px rgba(0, 243, 255, 0.2)'
                }}
              />
            </div>
          )}

          
          {activeTab === 'researchers' ? (
            loading && researchers.length === 0 ? <p>กำลังโหลดข้อมูล...</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {researchers.filter(r => 
                  (r.name_th || r.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                  (r.name_en || "").toLowerCase().includes(searchQuery.toLowerCase())
                ).map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px', background: 'rgba(10, 15, 30, 0.5)' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{r.name_th || r.name} <span style={{fontSize:'0.9rem', color:'#888'}}>({r.name_en})</span></h3>
                      <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem' }}>{r.position_th || r.position}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {(() => {
                        const missing = checkMissingFields(r);
                        if (missing.length === 0) {
                          return <span title="ข้อมูลครบถ้วน" style={{ fontSize: '1.5rem', cursor: 'help' }}>✅</span>;
                        } else {
                          return (
                            <span 
                              title={`ข้อมูลที่ยังขาด:\n- ${missing.join('\n- ')}`} 
                              style={{ 
                                fontSize: '1.5rem', 
                                cursor: 'help', 
                                background: 'rgba(255, 0, 0, 0.2)', 
                                borderRadius: '50%', 
                                width: '30px', 
                                height: '30px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                border: '1px solid red'
                              }}
                            >
                              ⚠️
                            </span>
                          );
                        }
                      })()}
                      <button onClick={() => editResItem(r)} className="btn btn-warning" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} disabled={loading}>แก้ไข</button>
                      <button onClick={() => handleDeleteRes(r.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} disabled={loading}>ลบ</button>
                    </div>
                  </div>
                ))}
                {researchers.length === 0 && !loading && <p>ยังไม่มีข้อมูล</p>}
              </div>
            )
          ) : (
            loading && news.length === 0 ? <p>กำลังโหลดข้อมูล...</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {news.map(n => (
                  <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px', background: 'rgba(10, 15, 30, 0.5)' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{n.title_th || n.title}</h3>
                      <p style={{ color: '#888', fontSize: '0.8rem' }}>{new Date(n.published_date).toLocaleDateString('th-TH')}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => editNewsItem(n)} className="btn btn-warning" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} disabled={loading}>แก้ไข</button>
                      <button onClick={() => handleDeleteNews(n.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} disabled={loading}>ลบ</button>
                    </div>
                  </div>
                ))}
                {news.length === 0 && !loading && <p>ยังไม่มีข้อมูล</p>}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '1rem',
  border: '1px solid rgba(0, 243, 255, 0.3)',
  borderRadius: '8px',
  fontSize: '1.1rem',
  background: 'rgba(10, 15, 30, 0.7)',
  color: '#ffffff'
};
