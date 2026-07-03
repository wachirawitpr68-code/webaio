"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

type Tab = 'researchers' | 'news';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [activeTab, setActiveTab] = useState<Tab>('researchers');
  const [loading, setLoading] = useState(false);

  // Researchers state
  const [researchers, setResearchers] = useState<any[]>([]);
  const [editingResId, setEditingResId] = useState<number | null>(null);
  const [resFormData, setResFormData] = useState({
    name_th: "", name_en: "", 
    position_th: "", position_en: "", 
    bio_th: "", bio_en: "", 
    scholar_link: "", image_url: ""
  });

  // News state
  const [news, setNews] = useState<any[]>([]);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [newsFormData, setNewsFormData] = useState({
    title_th: "", title_en: "",
    content_th: "", content_en: "",
    image_url: ""
  });

  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === 'researchers') fetchResearchers();
      else if (activeTab === 'news') fetchNews();
    }
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

  // --- Researchers Handlers ---
  const handleSaveRes = async () => {
    if (!resFormData.name_th) return alert("กรุณาใส่ชื่อนักวิจัย (TH)");
    setLoading(true);
    try {
      if (editingResId) {
        const { error } = await supabase.from('researchers').update(resFormData).eq('id', editingResId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('researchers').insert([resFormData]);
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
      scholar_link: r.scholar_link || "", image_url: r.image_url || ""
    });
  };

  const resetResForm = () => {
    setEditingResId(null);
    setResFormData({ name_th: "", name_en: "", position_th: "", position_en: "", bio_th: "", bio_en: "", scholar_link: "", image_url: "" });
  };

  // --- News Handlers ---
  const handleSaveNews = async () => {
    if (!newsFormData.title_th) return alert("กรุณาใส่หัวข้อข่าว (TH)");
    setLoading(true);
    try {
      if (editingNewsId) {
        const { error } = await supabase.from('news').update(newsFormData).eq('id', editingNewsId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('news').insert([newsFormData]);
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
  };

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNewsFormData({ title_th: "", title_en: "", content_th: "", content_en: "", image_url: "" });
  };


  if (!isLoggedIn) {
    return (
      <div style={{ padding: '5rem 1rem', maxWidth: '500px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--color-primary)' }}>เข้าสู่ระบบ Admin</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--color-gray-50)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--color-gray-200)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>รหัสผ่าน</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ใส่รหัสผ่าน..." 
              style={{ width: '100%', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }} 
            />
          </div>
          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" style={{ marginTop: '0.5rem', width: '100%', padding: '1rem', fontSize: '1.1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>Admin Dashboard</h1>
        <button onClick={() => setIsLoggedIn(false)} className="btn btn-danger">ออกจากระบบ</button>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--color-gray-200)' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form */}
        <div style={{ background: 'var(--color-gray-50)', padding: '2rem', borderRadius: '12px', alignSelf: 'start', border: '1px solid var(--color-gray-200)' }}>
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
              <input type="text" placeholder="ลิงก์ Google Scholar" value={resFormData.scholar_link} onChange={e => setResFormData({...resFormData, scholar_link: e.target.value})} style={inputStyle} disabled={loading} />
              <input type="text" placeholder="ลิงก์รูปภาพ URL" value={resFormData.image_url} onChange={e => setResFormData({...resFormData, image_url: e.target.value})} style={inputStyle} disabled={loading} />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleSaveRes} className="btn" style={{ flex: 1, backgroundColor: 'var(--color-primary)', color: 'white' }} disabled={loading}>
                  {loading ? "กำลังบันทึก..." : "บันทึก"}
                </button>
                {editingResId && <button onClick={resetResForm} className="btn" style={{ background: '#ccc' }} disabled={loading}>ยกเลิก</button>}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="หัวข้อข่าว (TH)" value={newsFormData.title_th} onChange={e => setNewsFormData({...newsFormData, title_th: e.target.value})} style={inputStyle} disabled={loading} />
              <input type="text" placeholder="Title (EN)" value={newsFormData.title_en} onChange={e => setNewsFormData({...newsFormData, title_en: e.target.value})} style={inputStyle} disabled={loading} />
              <textarea placeholder="เนื้อหาข่าวสั้นๆ (TH)" rows={4} value={newsFormData.content_th} onChange={e => setNewsFormData({...newsFormData, content_th: e.target.value})} style={inputStyle} disabled={loading} />
              <textarea placeholder="Content (EN)" rows={4} value={newsFormData.content_en} onChange={e => setNewsFormData({...newsFormData, content_en: e.target.value})} style={inputStyle} disabled={loading} />
              <input type="text" placeholder="ลิงก์รูปภาพประกอบ URL" value={newsFormData.image_url} onChange={e => setNewsFormData({...newsFormData, image_url: e.target.value})} style={inputStyle} disabled={loading} />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleSaveNews} className="btn" style={{ flex: 1, backgroundColor: 'var(--color-primary)', color: 'white' }} disabled={loading}>
                  {loading ? "กำลังบันทึก..." : "บันทึก"}
                </button>
                {editingNewsId && <button onClick={resetNewsForm} className="btn" style={{ background: '#ccc' }} disabled={loading}>ยกเลิก</button>}
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            {activeTab === 'researchers' ? 'รายชื่อผู้วิจัยทั้งหมด' : 'รายการข่าวสารทั้งหมด'}
          </h2>
          
          {activeTab === 'researchers' ? (
            loading && researchers.length === 0 ? <p>กำลังโหลดข้อมูล...</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {researchers.map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px', backgroundColor: 'white' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{r.name_th || r.name} <span style={{fontSize:'0.9rem', color:'#888'}}>({r.name_en})</span></h3>
                      <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem' }}>{r.position_th || r.position}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                  <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px', backgroundColor: 'white' }}>
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
  padding: '0.8rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '0.95rem'
};
