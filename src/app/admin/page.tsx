"use client";

import { useState, useEffect } from "react";

// Mock data (Normally this would come from Prisma DB/Supabase)
const initialResearchers = [
  {
    id: 1,
    name: "ผศ.ดร. สมชาย มุ่งมั่น",
    position: "หัวหน้ากลุ่มวิจัย",
    bio: "ผู้เชี่ยวชาญด้านปัญญาประดิษฐ์ (Artificial Intelligence) และการเรียนรู้ของเครื่อง (Machine Learning)",
    scholarLink: "https://scholar.google.com/",
    imageUrl: "https://ui-avatars.com/api/?name=Somchai&background=d32f2f&color=fff"
  },
  {
    id: 2,
    name: "ดร. สมศรี รักเรียน",
    position: "นักวิจัยอาวุโส",
    bio: "มีความเชี่ยวชาญด้านการประมวลผลภาษาธรรมชาติ (NLP) และโมเดลภาษาขนาดใหญ่ (LLMs)",
    scholarLink: "https://scholar.google.com/",
    imageUrl: "https://ui-avatars.com/api/?name=Somsri&background=fbc02d&color=000"
  },
  {
    id: 3,
    name: "อ. มานะ พัฒนา",
    position: "นักวิจัย",
    bio: "สนใจงานวิจัยทางด้าน Data Science และสถาปัตยกรรมระบบคลาวด์",
    scholarLink: "https://scholar.google.com/",
    imageUrl: "https://ui-avatars.com/api/?name=Mana&background=1976d2&color=fff"
  }
];

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Dashboard state
  const [researchers, setResearchers] = useState(initialResearchers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "", position: "", bio: "", scholarLink: "", imageUrl: ""
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("aio_researchers");
    if (saved) {
      setResearchers(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "aio12345678") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("รหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleSave = () => {
    let updated;
    if (editingId) {
      // Update
      updated = researchers.map(r => r.id === editingId ? { ...formData, id: r.id } : r);
    } else {
      // Add new
      const newId = researchers.length > 0 ? Math.max(...researchers.map(r => r.id)) + 1 : 1;
      updated = [...researchers, { ...formData, id: newId }];
    }
    
    setResearchers(updated);
    localStorage.setItem("aio_researchers", JSON.stringify(updated));
    resetForm();
    alert("บันทึกข้อมูลเรียบร้อยแล้ว (บันทึกใน Local Storage)");
  };

  const handleDelete = (id: number) => {
    if (confirm("ต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
      const updated = researchers.filter(r => r.id !== id);
      setResearchers(updated);
      localStorage.setItem("aio_researchers", JSON.stringify(updated));
    }
  };

  const editItem = (r: any) => {
    setEditingId(r.id);
    setFormData({
      name: r.name,
      position: r.position,
      bio: r.bio,
      scholarLink: r.scholarLink,
      imageUrl: r.imageUrl
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", position: "", bio: "", scholarLink: "", imageUrl: "" });
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '5rem 1rem', maxWidth: '500px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>เข้าสู่ระบบ Admin</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>รหัสผ่าน</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ใส่รหัสผ่าน..." 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>
          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>เข้าสู่ระบบ</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>จัดการข้อมูล (Admin Dashboard)</h1>
        <button onClick={() => setIsLoggedIn(false)} className="btn btn-danger">ออกจากระบบ</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form */}
        <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px', alignSelf: 'start' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? "แก้ไขข้อมูลนักวิจัย" : "เพิ่มนักวิจัยใหม่"}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="ชื่อ-นามสกุล" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="ตำแหน่ง" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} style={inputStyle} />
            <textarea placeholder="ประวัติย่อ / ความสนใจ" rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="ลิงก์ Google Scholar" value={formData.scholarLink} onChange={e => setFormData({...formData, scholarLink: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="ลิงก์รูปภาพ URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={inputStyle} />
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>บันทึก</button>
              {editingId && <button onClick={resetForm} className="btn" style={{ background: '#ccc' }}>ยกเลิก</button>}
            </div>
          </div>
        </div>

        {/* List */}
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>รายชื่อผู้วิจัยทั้งหมด</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {researchers.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{r.name}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{r.position}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => editItem(r)} className="btn btn-warning" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>แก้ไข</button>
                  <button onClick={() => handleDelete(r.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>ลบ</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.8rem',
  border: '1px solid #ccc',
  borderRadius: '4px'
};
