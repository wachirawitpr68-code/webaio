export default function Contact() {
  return (
    <div style={{ padding: '5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>ติดต่อเรา</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>ข้อมูลการติดต่อ</h2>
          <p style={{ marginBottom: '1rem' }}><strong>อีเมล:</strong> contact@aiolab.ubu.ac.th</p>
          <p style={{ marginBottom: '1rem' }}><strong>ที่อยู่:</strong> กลุ่มวิจัย AIO LAB, คณะวิทยาศาสตร์ มหาวิทยาลัยอุบลราชธานี</p>
          <p style={{ marginBottom: '1rem' }}>85 ถ.สถลมาร์ค ต.เมืองศรีไค อ.วารินชำราบ จ.อุบลราชธานี 34190</p>
        </div>
        <div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="ชื่อ-นามสกุล" style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input type="email" placeholder="อีเมลของคุณ" style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            <textarea placeholder="ข้อความที่ต้องการติดต่อ" rows={5} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
            <button type="button" className="btn btn-primary" style={{ width: '150px' }}>ส่งข้อความ</button>
          </form>
        </div>
      </div>
    </div>
  );
}
