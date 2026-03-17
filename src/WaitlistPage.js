import React from 'react';

export default function WaitlistPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0f2e 50%, #0a0a0f 100%)',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>

      {/* NAVBAR */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        borderBottom: '1px solid rgba(138, 43, 226, 0.3)',
        background: 'rgba(10, 10, 15, 0.95)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            fontSize: '28px',
            background: 'linear-gradient(135deg, #00ff88, #8a2be2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>⚡</span>
          <span style={{
            fontSize: '22px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #8a2be2, #00ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>SHOCKER DEALS</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        textAlign: 'center',
        padding: '60px 20px 30px',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '14px',
          color: '#00ff88',
          marginBottom: '20px',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          ⚡ Coming Soon To Tallahassee
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          Every Deal.
          <br />
          <span style={{
            background: 'linear-gradient(90deg, #00ff88, #8a2be2, #ff1493)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Every Dispensary.
          </span>
          <br />
          One Place.
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#aaa',
          marginBottom: '20px',
          maxWidth: '500px',
          margin: '0 auto 20px'
        }}>
          Stop checking 10 different websites.
          Get the best cannabis deals in Tallahassee
          delivered to you.
        </p>

        {/* HOW IT WORKS - MINI */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          {[
            { icon: '🏪', text: 'Every Dispensary' },
            { icon: '🔥', text: 'Best Deals Daily' },
            { icon: '💰', text: '100% Free' }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ccc',
              fontSize: '16px'
            }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TALLY FORM EMBED */}
      <section style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 20px 40px'
      }}>
        <div style={{
          background: 'rgba(138, 43, 226, 0.1)',
          borderRadius: '20px',
          border: '1px solid rgba(138, 43, 226, 0.2)',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '24px',
            marginBottom: '10px'
          }}>
            🔔 Join The Waitlist
          </h3>
          <p style={{
            color: '#aaa',
            marginBottom: '25px'
          }}>
            Be the first to know when we launch!
          </p>

          {/* REPLACE WITH YOUR TALLY FORM ID */}
          <iframe
            src="https://tally.so/embed/EkQo9L?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            width="100%"
            height="300"
            frameBorder="0"
            title="Waitlist Signup"
            style={{
              border: 'none',
              borderRadius: '10px'
            }}
          />
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{
        textAlign: 'center',
        padding: '40px 20px',
        borderTop: '1px solid rgba(138, 43, 226, 0.2)'
      }}>
        <p style={{
          color: '#666',
          fontSize: '14px'
        }}>
          Join hundreds of deal hunters waiting for launch ⚡
        </p>
      </section>

      {/* DISPENSARY CTA */}
      <section style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'rgba(138, 43, 226, 0.05)',
        borderTop: '1px solid rgba(138, 43, 226, 0.2)'
      }}>
        <p style={{
          fontSize: '18px',
          marginBottom: '15px'
        }}>
          🏪 Own a dispensary?
        </p>
        <p style={{
          color: '#aaa',
          marginBottom: '20px'
        }}>
          List your deals for FREE
        </p>
        <a
          href="mailto:hello@shockerdeals.shop"
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
            color: '#0a0a0f',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}
        >
          Contact Us →
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '30px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(138, 43, 226, 0.2)',
        color: '#666'
      }}>
        <p style={{
          background: 'linear-gradient(90deg, #8a2be2, #00ff88)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          fontSize: '16px',
          marginBottom: '10px'
        }}>
          ⚡ Shocker Deals
        </p>
        <p style={{ fontSize: '12px' }}>© 2025 Shocker Deals. All rights reserved.</p>
        <p style={{ marginTop: '10px' }}>
          <a href="mailto:hello@shockerdeals.shop" 
            style={{ color: '#8a2be2', textDecoration: 'none', fontSize: '13px' }}>
            hello@shockerdeals.shop
          </a>
        </p>
      </footer>
    </div>
  );
}