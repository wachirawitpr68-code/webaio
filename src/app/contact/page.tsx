export default function Contact() {
  return (
    <div style={{ padding: '5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Contact Us</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Get in Touch</h2>
          <p style={{ marginBottom: '1rem' }}><strong>Email:</strong> contact@aiolab.com</p>
          <p style={{ marginBottom: '1rem' }}><strong>Address:</strong> AIO LAB, Science Building, Innovation City</p>
        </div>
        <div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Name" style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input type="email" placeholder="Email" style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            <textarea placeholder="Message" rows={5} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
            <button type="button" className="btn btn-primary" style={{ width: '150px' }}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
