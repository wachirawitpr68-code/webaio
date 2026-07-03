export default function News() {
  return (
    <div style={{ padding: '5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>News & Activities</h1>
      <p>Latest updates from AIO LAB will be displayed here.</p>
      
      <div style={{ marginTop: '3rem', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '8px', borderTop: '4px solid #d32f2f' }}>
          <div style={{ color: '#888', marginBottom: '1rem' }}>July 3, 2026</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AIO LAB Launched</h3>
          <p>We are excited to announce the official launch of our new laboratory website.</p>
        </div>
      </div>
    </div>
  );
}
