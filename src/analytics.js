// ============================================================
// analytics.js — UTM Tracking & Google Analytics Utilities
// for Shocker Deals (shockerdeals.netlify.app)
// ============================================================
//
// This file handles:
// 1. Capturing UTM parameters from URLs (utm_source, utm_medium, etc.)
// 2. Storing UTM data in localStorage so it persists across pages
// 3. Sending UTM data to Google Analytics as custom event parameters
// 4. Providing a trackEvent() function you can use anywhere in the app
//
// HOW UTM LINKS WORK:
// When you share a link like:
//   shockerdeals.netlify.app?utm_source=facebook&utm_medium=post&utm_campaign=day1
// This script captures those parameters so you know exactly which
// post brought that visitor to your site.
// ============================================================

// ── CAPTURE UTM PARAMETERS ──────────────────────────────────
// Reads UTM params from the current URL and saves them to localStorage.
// Called once when the app first loads.
export function captureUTMParams() {
  try {
    const params = new URLSearchParams(window.location.search);

    // List of UTM parameters we want to track
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    // Only save if at least one UTM param exists in the URL
    const utmData = {};
    let hasUTM = false;

    utmKeys.forEach((key) => {
      const value = params.get(key);
      if (value) {
        utmData[key] = value;
        hasUTM = true;
      }
    });

    if (hasUTM) {
      // Add a timestamp so we know when this visit happened
      utmData.captured_at = new Date().toISOString();
      // Save to localStorage — this persists even if they navigate around
      localStorage.setItem('shocker_utm', JSON.stringify(utmData));

      // Send UTM data to Google Analytics as a custom event
      sendUTMToGA(utmData);
    }
  } catch (error) {
    console.error('Error capturing UTM params:', error);
  }
}

// ── GET STORED UTM DATA ──────────────────────────────────────
// Retrieves the saved UTM data from localStorage.
// Returns an object with the UTM params, or an empty object if none.
export function getUTMData() {
  try {
    const stored = localStorage.getItem('shocker_utm');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
}

// ── SEND UTM DATA TO GOOGLE ANALYTICS ────────────────────────
// Fires a custom GA4 event with the UTM parameters attached.
// This lets you see in Google Analytics which campaigns drive traffic.
function sendUTMToGA(utmData) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'utm_visit', {
      utm_source: utmData.utm_source || '(not set)',
      utm_medium: utmData.utm_medium || '(not set)',
      utm_campaign: utmData.utm_campaign || '(not set)',
      utm_content: utmData.utm_content || '(not set)',
      utm_term: utmData.utm_term || '(not set)',
    });
  }
}

// ── TRACK CUSTOM EVENTS ──────────────────────────────────────
// Use this function anywhere in your app to track specific actions.
//
// Examples:
//   trackEvent('waitlist_signup', { method: 'tally_form' });
//   trackEvent('budtender_click', { page: 'waitlist' });
//   trackEvent('deal_view', { strain: 'Blue Dream' });
//
export function trackEvent(eventName, params = {}) {
  try {
    // Merge UTM data with the event params so every event
    // carries the original traffic source info
    const utmData = getUTMData();
    const enrichedParams = {
      ...params,
      original_source: utmData.utm_source || 'direct',
      original_medium: utmData.utm_medium || 'none',
      original_campaign: utmData.utm_campaign || 'none',
    };

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, enrichedParams);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

// ── TRACK PAGE VIEW ──────────────────────────────────────────
// Sends a page_view event to GA4. Called when routes change.
export function trackPageView(path) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
    });
  }
}

// ── INITIALIZE ANALYTICS ─────────────────────────────────────
// Master function that sets everything up. Call this once in App.js.
export function initAnalytics() {
  // Capture UTM params from the URL
  captureUTMParams();

  // Track the initial page view
  trackPageView(window.location.pathname);
}
