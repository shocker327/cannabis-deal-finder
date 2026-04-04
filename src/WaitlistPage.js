// ============================================================
// WaitlistPage.js — Shocker Deals Pre-Launch Waitlist Page
// ============================================================
// This is the homepage while PRE_LAUNCH = true in App.js.
// It includes:
// 1. Hero section with branding
// 2. "Try Our AI Budtender" preview section (links to /app)
// 3. Feature cards showing what the Budtender can do
// 4. Tally waitlist signup form
// 5. Dispensary CTA section
// 6. Footer with social links
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from './analytics';

export default function WaitlistPage() {
  const navigate = useNavigate();

  // Track when someone clicks the "Try Our AI Budtender" button
  const handleBudtenderClick = () => {
    trackEvent('budtender_preview_click', { page: 'waitlist' });
    navigate('/app');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0f2e 50%, #0a0a0f 100%)',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>

      {/* ==================== NAVBAR ==================== */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        borderBottom: '1px solid rgba(138, 43, 226, 0.3)',
        background: 'rgba(10, 10, 15, 0.95)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="/shocker-deals-logo.jpeg"
            alt="Shocker Deals"
            style={{
              height: '45px',
              borderRadius: '8px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span style={{
            fontSize: '22px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #8a2be2, #00ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>SHOCKER DEALS</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="#budtender" style={{
            color: '#00ff88',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'opacity 0.3s'
          }}>
            AI Budtender
          </a>
          <a href="#waitlist" style={{
            color: '#aaa',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.3s'
          }}
            onMouseOver={(e) => e.target.style.color = '#00ff88'}
            onMouseOut={(e) => e.target.style.color = '#aaa'}
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
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

      {/* ==================== AI BUDTENDER PREVIEW SECTION ==================== */}
      <section id="budtender" style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '0 20px 50px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(0, 255, 136, 0.1))',
          borderRadius: '20px',
          border: '2px solid rgba(0, 255, 136, 0.3)',
          padding: '40px 30px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative glow effect */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15), transparent)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.2), transparent)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          <div style={{
            fontSize: '14px',
            color: '#00ff88',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            ✨ Try It Now — It's Live!
          </div>

          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '15px',
            lineHeight: '1.3'
          }}>
            Meet{' '}
            <span style={{
              background: 'linear-gradient(90deg, #00ff88, #8a2be2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Professor Shocker
            </span>
          </h2>

          <p style={{
            fontSize: '18px',
            color: '#ccc',
            marginBottom: '10px',
            maxWidth: '500px',
            margin: '0 auto 10px',
            lineHeight: '1.6'
          }}>
            Your personal AI cannabis concierge.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#aaa',
            marginBottom: '30px',
            maxWidth: '480px',
            margin: '0 auto 30px',
            lineHeight: '1.6'
          }}>
            Ask about strains, terpenes, effects, med cards,
            dispensary loyalty programs, recipes, and more — powered by
            real cannabis expertise.
          </p>

          {/* CTA BUTTON */}
          <button
            onClick={handleBudtenderClick}
            style={{
              padding: '18px 50px',
              background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              color: '#0a0a0f',
              border: 'none',
              borderRadius: '30px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 25px rgba(0, 255, 136, 0.4)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 35px rgba(0, 255, 136, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 255, 136, 0.4)';
            }}
          >
            🌿 Try Our AI Budtender
          </button>

          <p style={{
            color: '#888',
            fontSize: '13px',
            marginTop: '15px'
          }}>
            Free to use — no signup required
          </p>
        </div>
      </section>

      {/* ==================== WHAT THE BUDTENDER CAN DO ==================== */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 20px 60px'
      }}>
        <h3 style={{
          fontSize: '26px',
          textAlign: 'center',
          marginBottom: '30px',
          color: '#fff'
        }}>
          What Can{' '}
          <span style={{
            background: 'linear-gradient(90deg, #8a2be2, #00ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Professor Shocker
          </span>
          {' '}Help With?
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '15px'
        }}>
          {[
            {
              icon: '🌿',
              title: 'Strain Finder',
              desc: 'Find the perfect strain based on effects, flavors, and strength you want'
            },
            {
              icon: '🧬',
              title: 'Terpene Expert',
              desc: 'Learn about terpenes — the compounds that give each strain its unique effects'
            },
            {
              icon: '💊',
              title: 'Med Card Guide',
              desc: 'Step-by-step Florida medical cannabis card process, costs, and requirements'
            },
            {
              icon: '⭐',
              title: 'Loyalty Programs',
              desc: 'Trulieve, Surterra, Curaleaf, MÜV — learn how to maximize your rewards'
            },
            {
              icon: '🍪',
              title: 'Recipes & Methods',
              desc: 'Cannabutter, gummies, tinctures, edibles — full step-by-step instructions'
            },
            {
              icon: '📋',
              title: 'FL Compliance',
              desc: 'Know your rights — supply limits, qualifying conditions, and patient rules'
            }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'rgba(138, 43, 226, 0.08)',
              borderRadius: '15px',
              border: '1px solid rgba(138, 43, 226, 0.15)',
              padding: '22px 18px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.3)';
                e.currentTarget.style.background = 'rgba(138, 43, 226, 0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.15)';
                e.currentTarget.style.background = 'rgba(138, 43, 226, 0.08)';
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{feature.icon}</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#00ff88'
              }}>
                {feature.title}
              </h4>
              <p style={{
                color: '#aaa',
                fontSize: '13px',
                lineHeight: '1.5',
                margin: 0
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== TALLY FORM EMBED (WAITLIST) ==================== */}
      <section id="waitlist" style={{
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
            Be the first to know when we launch with live dispensary deals!
          </p>

          {/* TALLY FORM */}
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

      {/* ==================== SOCIAL PROOF ==================== */}
      <section style={{
        textAlign: 'center',
        padding: '40px 20px',
        borderTop: '1px solid rgba(138, 43, 226, 0.2)'
      }}>
        <p style={{
          color: '#666',
          fontSize: '14px'
        }}>
          Join deal hunters waiting for launch ⚡
        </p>
      </section>

      {/* ==================== DISPENSARY CTA ==================== */}
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
          List your deals for FREE and reach more customers
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
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Contact Us →
        </a>
      </section>

      {/* ==================== FOOTER ==================== */}
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
        <p style={{ fontSize: '12px', marginBottom: '10px' }}>© 2026 Shocker Deals. All rights reserved.</p>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '10px'
        }}>
          <a href="https://instagram.com/shockerdeals" target="_blank" rel="noreferrer"
            style={{ color: '#8a2be2', textDecoration: 'none', fontSize: '13px' }}>
            Instagram
          </a>
          <a href="https://tiktok.com/@shockerdeals" target="_blank" rel="noreferrer"
            style={{ color: '#8a2be2', textDecoration: 'none', fontSize: '13px' }}>
            TikTok
          </a>
          <a href="https://facebook.com/shockerdeals" target="_blank" rel="noreferrer"
            style={{ color: '#8a2be2', textDecoration: 'none', fontSize: '13px' }}>
            Facebook
          </a>
        </div>
        <p>
          <a href="mailto:hello@shockerdeals.shop"
            style={{ color: '#8a2be2', textDecoration: 'none', fontSize: '13px' }}>
            hello@shockerdeals.shop
          </a>
        </p>
      </footer>
    </div>
  );
}
