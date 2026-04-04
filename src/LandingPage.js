import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const categories = ['All', 'Flower', 'Edibles', 'Concentrates', 'Vapes', 'Pre-Rolls', 'Topicals', 'Other'];

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const dealsSnapshot = await getDocs(collection(db, 'deals'));
        const dealsList = dealsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDeals(dealsList);
        setFilteredDeals(dealsList);
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
      setLoading(false);
    };
    fetchDeals();
  }, []);

  // Search and filter logic
  useEffect(() => {
    let results = deals;

    if (activeCategory !== 'All') {
      results = results.filter(deal =>
        deal.category && deal.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      results = results.filter(deal =>
        (deal.title && deal.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (deal.description && deal.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (deal.dispensaryName && deal.dispensaryName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredDeals(results);
  }, [searchTerm, activeCategory, deals]);

  // Email signup handler
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email');
      return;
    }

    try {
      await addDoc(collection(db, 'newsletter'), {
        email: email,
        subscribedAt: serverTimestamp(),
        source: 'landing_page'
      });
      setEmailSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Error saving email:', error);
      setEmailError('Something went wrong. Try again!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0f2e 50%, #0a0a0f 100%)',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>

      {/* ==================== NAVIGATION BAR ==================== */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        borderBottom: '1px solid rgba(138, 43, 226, 0.3)',
        position: 'sticky',
        top: 0,
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}>
        <div
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  style={{
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }}
>
  <img
    src="/shocker-deals-logo.jpeg"
    alt="Shocker Deals"
    style={{
      height: '45px',
      borderRadius: '8px'
    }}
  />
  <span style={{
    fontSize: '20px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #8a2be2, #00ff88)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>
    SHOCKER DEALS
  </span>
</div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <a href="#deals" style={{
            color: '#aaa',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.3s'
          }}
            onMouseOver={(e) => e.target.style.color = '#00ff88'}
            onMouseOut={(e) => e.target.style.color = '#aaa'}
          >Deals</a>
          <a href="#how-it-works" style={{
            color: '#aaa',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.3s'
          }}
            onMouseOver={(e) => e.target.style.color = '#00ff88'}
            onMouseOut={(e) => e.target.style.color = '#aaa'}
          >How It Works</a>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 20px',
              background: 'transparent',
              border: '2px solid #8a2be2',
              color: '#8a2be2',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#8a2be2';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#8a2be2';
            }}
          >
            Dispensary Login
          </button>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section style={{
        textAlign: 'center',
        padding: '80px 20px 60px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '14px',
          color: '#00ff88',
          marginBottom: '20px',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          ⚡ Tallahassee's #1 Deal Finder
        </div>
        <h2 style={{
          fontSize: '52px',
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
        </h2>
        <p style={{
          fontSize: '20px',
          color: '#aaa',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Stop checking 10 different websites. Shocker Deals
          finds you the best cannabis deals across ALL
          dispensaries in Tallahassee.
        </p>
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a href="#deals" style={{
            padding: '15px 40px',
            background: 'linear-gradient(135deg, #8a2be2, #6a1fb2)',
            color: 'white',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(138, 43, 226, 0.4)',
            transition: 'all 0.3s ease'
          }}>
            🔥 Browse Deals
          </a>
          <a href="#how-it-works" style={{
            padding: '15px 40px',
            background: 'transparent',
            color: '#00ff88',
            border: '2px solid #00ff88',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}>
            How It Works
          </a>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '60px',
        padding: '40px 20px',
        flexWrap: 'wrap',
        borderTop: '1px solid rgba(138, 43, 226, 0.2)',
        borderBottom: '1px solid rgba(138, 43, 226, 0.2)',
        background: 'rgba(138, 43, 226, 0.05)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00ff88' }}>
            {deals.length}
          </div>
          <div style={{ color: '#aaa', fontSize: '14px' }}>Active Deals</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff1493' }}>⚡</div>
          <div style={{ color: '#aaa', fontSize: '14px' }}>Updated Daily</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8a2be2' }}>100%</div>
          <div style={{ color: '#aaa', fontSize: '14px' }}>Free To Use</div>
        </div>
      </section>

      {/* ==================== SEARCH & FILTER BAR ==================== */}
      <section id="deals" style={{
        padding: '60px 20px 20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h3 style={{
          fontSize: '36px',
          textAlign: 'center',
          marginBottom: '30px',
          background: 'linear-gradient(90deg, #ff1493, #8a2be2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🔥 Today's Deals
        </h3>

        {/* Search Bar */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 25px',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="🔍 Search deals, dispensaries, products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 20px 15px 20px',
              borderRadius: '30px',
              border: '2px solid rgba(138, 43, 226, 0.3)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#8a2be2'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(138, 43, 226, 0.3)'}
          />
        </div>

        {/* Category Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: activeCategory === category ? 'none' : '1px solid rgba(138, 43, 226, 0.3)',
                background: activeCategory === category
                  ? 'linear-gradient(135deg, #8a2be2, #6a1fb2)'
                  : 'rgba(255,255,255,0.05)',
                color: activeCategory === category ? 'white' : '#aaa',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeCategory === category ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {category === 'All' && '🔥 '}
              {category === 'Flower' && '🌿 '}
              {category === 'Edibles' && '🍪 '}
              {category === 'Concentrates' && '💎 '}
              {category === 'Vapes' && '💨 '}
              {category === 'Pre-Rolls' && '🚬 '}
              {category === 'Topicals' && '🧴 '}
              {category === 'Other' && '📦 '}
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {searchTerm || activeCategory !== 'All' ? (
          <p style={{
            textAlign: 'center',
            color: '#aaa',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            Showing {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        ) : null}
      </section>

      {/* ==================== DEALS GRID ==================== */}
      <section style={{
        padding: '0 20px 80px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#aaa' }}>Loading deals...</p>
        ) : filteredDeals.length === 0 && (searchTerm || activeCategory !== 'All') ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(138, 43, 226, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(138, 43, 226, 0.2)'
          }}>
            <p style={{ fontSize: '36px', marginBottom: '10px' }}>😕</p>
            <h4 style={{ marginBottom: '10px' }}>No deals found</h4>
            <p style={{ color: '#aaa' }}>Try a different search or category</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              style={{
                marginTop: '15px',
                padding: '10px 25px',
                background: '#8a2be2',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : deals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(138, 43, 226, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(138, 43, 226, 0.2)'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>🔜</p>
            <h4 style={{ fontSize: '24px', marginBottom: '10px' }}>Deals Coming Soon!</h4>
            <p style={{ color: '#aaa', fontSize: '16px' }}>
              We're onboarding Tallahassee dispensaries now.
              <br />Sign up below to get notified when deals drop! ⚡
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {filteredDeals.map(deal => (
              <div key={deal.id} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(138, 43, 226, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(138, 43, 226, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Category Badge */}
                {deal.category && (
                  <span style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'rgba(0, 255, 136, 0.15)',
                    color: '#00ff88',
                    padding: '3px 10px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {deal.category}
                  </span>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #8a2be2, #6a1fb2)',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    🏪 {deal.dispensaryName || 'Dispensary'}
                  </span>
                </div>
                <h4 style={{
                  fontSize: '18px',
                  marginBottom: '8px',
                  color: 'white'
                }}>
                  {deal.title || 'Great Deal'}
                </h4>
                <p style={{
                  color: '#aaa',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  marginBottom: '10px'
                }}>
                  {deal.description || 'Check out this amazing deal!'}
                </p>
                {deal.price && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(138, 43, 226, 0.15)'
                  }}>
                    <span style={{
                      color: '#ff1493',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}>
                      {deal.price}
                    </span>
                    <span style={{
                      color: '#00ff88',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      View Deal →
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" style={{
        padding: '80px 20px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '36px',
          marginBottom: '50px',
          background: 'linear-gradient(90deg, #8a2be2, #00ff88)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          How It Works
        </h3>
        <div style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: '🏪', title: 'Dispensaries Post Deals', desc: 'Local dispensaries submit their daily specials and promotions directly to our platform' },
            { icon: '⚡', title: 'We Aggregate Everything', desc: 'All deals from every dispensary displayed in one clean easy-to-browse feed' },
            { icon: '💰', title: 'You Save Money', desc: 'Compare deals side by side and find the best prices instantly. Never overpay again!' }
          ].map((step, i) => (
            <div key={i} style={{
              flex: '1',
              minWidth: '250px',
              padding: '35px 25px',
              background: 'rgba(138, 43, 226, 0.1)',
              borderRadius: '15px',
              border: '1px solid rgba(138, 43, 226, 0.2)',
              transition: 'all 0.3s ease'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(138, 43, 226, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(138, 43, 226, 0.1)';
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '15px'
              }}>{step.icon}</div>
              <div style={{
                background: '#8a2be2',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {i + 1}
              </div>
              <h4 style={{ fontSize: '20px', marginBottom: '10px', color: '#00ff88' }}>
                {step.title}
              </h4>
              <p style={{ color: '#aaa', lineHeight: '1.6' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== DISPENSARY PARTNERS ==================== */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(138, 43, 226, 0.2)',
        background: 'rgba(138, 43, 226, 0.03)'
      }}>
        <div style={{
          fontSize: '14px',
          color: '#8a2be2',
          marginBottom: '10px',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          Trusted By
        </div>
        <h3 style={{
          fontSize: '32px',
          marginBottom: '15px'
        }}>
          Our Dispensary Partners
        </h3>
        <p style={{
          color: '#aaa',
          marginBottom: '40px',
          fontSize: '16px'
        }}>
          Tallahassee's best dispensaries trust Shocker Deals
        </p>

        {/* Partner Logos Grid */}
        <div style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: '800px',
          margin: '0 auto 40px',
          alignItems: 'center'
        }}>
          {/* Replace these with real logos as dispensaries sign up */}
          {['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4', 'Partner 5'].map((partner, i) => (
            <div key={i} style={{
              width: '130px',
              height: '80px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(138, 43, 226, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#555',
              fontSize: '12px'
            }}>
              {/* Replace with: <img src="/partners/logo.png" alt="" style={{maxWidth: '100px', maxHeight: '50px'}} /> */}
              Coming Soon
            </div>
          ))}
        </div>

        <p style={{ color: '#666', fontSize: '14px' }}>
          Want to be featured here?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#8a2be2', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Join for free →
          </span>
        </p>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '32px',
          marginBottom: '15px',
          background: 'linear-gradient(90deg, #00ff88, #8a2be2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          What People Are Saying
        </h3>
        <p style={{
          color: '#aaa',
          marginBottom: '40px'
        }}>
          Real feedback from real deal hunters
        </p>

        <div style={{
          display: 'flex',
          gap: '25px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {[
            {
              quote: "I used to check 5 different websites every morning. Now I just check Shocker Deals. Game changer!",
              name: "Mike T.",
              role: "Daily Shopper",
              stars: "⭐⭐⭐⭐⭐"
            },
            {
              quote: "We've seen a 30% increase in foot traffic since listing our deals on Shocker Deals. And it's free!",
              name: "Sarah K.",
              role: "Dispensary Manager",
              stars: "⭐⭐⭐⭐⭐"
            },
            {
              quote: "Best app for finding deals in Tallahassee. The search and filter features make it so easy to find what I want.",
              name: "James R.",
              role: "Medical Patient",
              stars: "⭐⭐⭐⭐⭐"
            }
          ].map((testimonial, i) => (
            <div key={i} style={{
              flex: '1',
              minWidth: '260px',
              maxWidth: '300px',
              padding: '30px',
              background: 'rgba(138, 43, 226, 0.08)',
              borderRadius: '15px',
              border: '1px solid rgba(138, 43, 226, 0.15)',
              textAlign: 'left'
            }}>
              <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                {testimonial.stars}
              </div>
              <p style={{
                color: '#ccc',
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '20px',
                fontStyle: 'italic'
              }}>
                "{testimonial.quote}"
              </p>
              <div>
                <div style={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: '15px'
                }}>
                  {testimonial.name}
                </div>
                <div style={{
                  color: '#00ff88',
                  fontSize: '13px'
                }}>
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== EMAIL NEWSLETTER SIGNUP ==================== */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(0, 255, 136, 0.05))',
        borderTop: '1px solid rgba(138, 43, 226, 0.2)',
        borderBottom: '1px solid rgba(138, 43, 226, 0.2)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📧</div>
        <h3 style={{
          fontSize: '32px',
          marginBottom: '10px'
        }}>
          Never Miss A Deal
        </h3>
        <p style={{
          color: '#aaa',
          fontSize: '18px',
          marginBottom: '30px',
          maxWidth: '500px',
          margin: '0 auto 30px'
        }}>
          Get the best dispensary deals delivered to your
          inbox daily. Free forever. Unsubscribe anytime.
        </p>

        {emailSubmitted ? (
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid #00ff88',
            padding: '20px 30px',
            borderRadius: '15px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <p style={{ fontSize: '24px', marginBottom: '5px' }}>🎉</p>
            <p style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '18px' }}>
              You're in! Watch your inbox for the best deals!
            </p>
          </div>
        ) : (
          <form onSubmit={handleEmailSignup} style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            maxWidth: '500px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '15px 20px',
                borderRadius: '30px',
                border: '2px solid rgba(138, 43, 226, 0.3)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8a2be2'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(138, 43, 226, 0.3)'}
            />
            <button
              type="submit"
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #8a2be2, #6a1fb2)',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(138, 43, 226, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              Subscribe ⚡
            </button>
          </form>
        )}
        {emailError && (
          <p style={{ color: '#ff4444', marginTop: '10px', fontSize: '14px' }}>
            {emailError}
          </p>
        )}
        <p style={{
          color: '#555',
          fontSize: '12px',
          marginTop: '15px'
        }}>
          🔒 No spam ever. Just deals.
        </p>
      </section>

      {/* ==================== DISPENSARY CTA ==================== */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '32px', marginBottom: '15px' }}>
          🏪 Own a Dispensary?
        </h3>
        <p style={{
          color: '#aaa',
          fontSize: '18px',
          marginBottom: '30px',
          maxWidth: '500px',
          margin: '0 auto 30px'
        }}>
          List your deals for FREE and reach more
          customers in Tallahassee
        </p>
        <div style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 40px'
        }}>
          {[
            { icon: '💰', text: '100% Free to list' },
            { icon: '📈', text: 'More foot traffic' },
            { icon: '⚡', text: 'Set up in 2 minutes' },
            { icon: '📊', text: 'Track your reach' }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ccc'
            }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '15px 40px',
            background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
            color: '#0a0a0f',
            border: 'none',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Get Started Free →
        </button>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer style={{
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(138, 43, 226, 0.2)',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <img
          src="/logo.png"
          alt="Shocker Deals"
          style={{ height: '35px', marginBottom: '15px' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <p style={{
          background: 'linear-gradient(90deg, #8a2be2, #00ff88)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          fontSize: '18px',
          marginBottom: '10px'
        }}>
          ⚡ Shocker Deals
        </p>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          © 2026 Shocker Deals. All rights reserved.
        </p>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '15px'
        }}>
          <a href="https://instagram.com/shockerdeals" target="_blank" rel="noreferrer"
            style={{ color: '#8a2be2', textDecoration: 'none', fontSize: '14px' }}>
            Instagram
          </a>
          <a href="https://tiktok.com/@shockerdeals" target="_blank" rel="noreferrer"
            style={{ color: '#8a2be2', textDecoration: 'none', fontSize: '14px' }}>
            TikTok
          </a>
          <a href="https://facebook.com/shockerdeals" target="_blank" rel="noreferrer"
            style={{ color: '#8a2be2', textDecoration: 'none', fontSize: '14px' }}>
            Facebook
          </a>
        </div>
        <p>
          <a href="mailto:hello@shockerdeals.shop"
            style={{ color: '#8a2be2', textDecoration: 'none', fontSize: '14px' }}>
            hello@shockerdeals.shop
          </a>
        </p>
      </footer>
    </div>
  );
}
