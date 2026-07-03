"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Dashboard state
  const [researchers, setResearchers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "", position: "", bio: "", scholar_link: "", image_url: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchResearchers();
    }
  }, [isLoggedIn]);

  const fetchResearchers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('researchers')
      .select('*')
      .order('id', { ascending: true });
    if (data) setResearchers(data);
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

  const handleSave = async () => {
    if (!formData.name) {
      alert("กรุณาใส่ชื่อนักวิจัย");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('researchers')
          .update({
            name: formData.name,
            position: formData.position,
            bio: formData.bio,
            scholar_link: formData.scholar_link,
            image_url: formData.image_url
          })
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('researchers')
          .insert([
            {
              name: formData.name,
              position: formData.position,
              bio: formData.bio,
              scholar_link: formData.scholar_link,
              image_url: formData.image_url
            }
          ]);
          
        if (error) throw error;
      }
      
      await fetchResearchers();
      resetForm();
      alert("บันทึกข้อมูลสำเร็จ!");
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("ต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
      setLoading(true);
      const { error } = await supabase
        .from('researchers')
        .delete()
        .eq('id', id);
      
      if (!error) {
        await fetchResearchers();
      } else {
        alert("เกิดข้อผิดพลาด: " + error.message);
      }
      setLoading(false);
    }
  };

  const editItem = (r: any) => {
    setEditingId(r.id);
    setFormData({
      name: r.name || "",
      position: r.position || "",
      bio: r.bio || "",
      scholar_link: r.scholar_link || "",
      image_url: r.image_url || ""
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", position: "", bio: "", scholar_link: "", image_url: "" });
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
        <h1 style={{ fontSize: '2.5rem' }}>จัดการข้อมูล (Supabase)</h1>
        <button onClick={() => setIsLoggedIn(false)} className="btn btn-danger">ออกจากระบบ</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form */}
        <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px', alignSelf: 'start' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? "แก้ไขข้อมูลนักวิจัย" : "เพิ่มนักวิจัยใหม่"}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="ชื่อ-นามสกุล" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} disabled={loading} />
            <input type="text" placeholder="ตำแหน่ง" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} style={inputStyle} disabled={loading} />
            <textarea placeholder="ประวัติย่อ / ความสนใจ" rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={inputStyle} disabled={loading} />
            <input type="text" placeholder="ลิงก์ Google Scholar" value={formData.scholar_link} onChange={e => setFormData({...formData, scholar_link: e.target.value})} style={inputStyle} disabled={loading} />
            <input type="text" placeholder="ลิงก์รูปภาพ URL" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={inputStyle} disabled={loading} />
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              {editingId && <button onClick={resetForm} className="btn" style={{ background: '#ccc' }} disabled={loading}>ยกเลิก</button>}
            </div>
          </div>
        </div>

        {/* List */}
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>รายชื่อผู้วิจัยทั้งหมด</h2>
          {loading && researchers.length === 0 ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {researchers.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{r.name}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{r.position}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => editItem(r)} className="btn btn-warning" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} disabled={loading}>แก้ไข</button>
                    <button onClick={() => handleDelete(r.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} disabled={loading}>ลบ</button>
                  </div>
                </div>
              ))}
              {researchers.length === 0 && !loading && (
                <p>ยังไม่มีข้อมูลนักวิจัย</p>
              )}
            </div>
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
  borderRadius: '4px'
};
