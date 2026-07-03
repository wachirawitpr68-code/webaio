export default function Admin() {
  return (
    <div style={{ padding: '5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Admin Dashboard</h1>
      <div style={{ background: '#f5f5f5', padding: '3rem', borderRadius: '8px', textAlign: 'center' }}>
        <h2>Login Required</h2>
        <p style={{ margin: '1.5rem 0' }}>Please login to manage Researchers and News.</p>
        <button className="btn btn-primary">Login</button>
      </div>
    </div>
  );
}
