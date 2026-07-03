export default function News() {
  return (
    <div style={{ padding: '5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>ข่าวสารและกิจกรรม</h1>
      <p>ติดตามความเคลื่อนไหว กิจกรรม และประกาศล่าสุดจาก AIO LAB</p>
      
      <div style={{ marginTop: '3rem', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '8px', borderTop: '4px solid #d32f2f' }}>
          <div style={{ color: '#888', marginBottom: '1rem' }}>3 กรกฎาคม 2026</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>เปิดตัวเว็บไซต์ AIO LAB อย่างเป็นทางการ</h3>
          <p>เรายินดีเป็นอย่างยิ่งที่ได้ประกาศเปิดตัวเว็บไซต์อย่างเป็นทางการ เพื่อเป็นพื้นที่รวบรวมและนำเสนองานวิจัยของมหาวิทยาลัยอุบลราชธานี</p>
        </div>
      </div>
    </div>
  );
}
