// ============================================================
// ChatWidget.js — Shocker's Budtender Chat Widget
// Powered by Professor Shocker
// ============================================================
// This component creates a floating chat bubble in the bottom-right
// corner of your website. When a customer clicks it, a chat window
// opens where they can talk to Shocker's Budtender AI.
//
// How it works:
// 1. Customer clicks the chat bubble
// 2. A welcome message appears from the Budtender
// 3. Customer types a message (or uses the mic button for voice input)
// 4. The message is sent to your Netlify serverless function
// 5. The function talks to OpenAI and sends back a reply
// 6. The reply appears in the chat window
//
// Voice Input (Web Speech API):
// - The mic button uses window.SpeechRecognition (or webkitSpeechRecognition)
// - If the browser doesn't support it, the mic button is hidden automatically
// - While listening, the mic button pulses red to show it's active
// - Recognized speech is placed into the input field for the user to review/send
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  // ── STATE VARIABLES ─────────────────────────────────────────
  // isOpen: whether the chat window is visible or hidden
  const [isOpen, setIsOpen] = useState(false);
  // messages: array of all messages in the conversation
  const [messages, setMessages] = useState([]);
  // inputMessage: what the user is currently typing
  const [inputMessage, setInputMessage] = useState('');
  // isTyping: shows a "typing..." indicator while waiting for AI
  const [isTyping, setIsTyping] = useState(false);
  // isListening: true while the mic is actively recording voice input
  const [isListening, setIsListening] = useState(false);
  // speechSupported: false if the browser doesn't support Web Speech API
  const [speechSupported, setSpeechSupported] = useState(false);

  // This ref lets us auto-scroll to the newest message
  const messagesEndRef = useRef(null);
  // This ref holds the SpeechRecognition instance so we can stop it
  const recognitionRef = useRef(null);

  // ── BUDTENDER NAME & WELCOME MESSAGE ────────────────────────
  const botName = "Shocker's Budtender";
  const welcomeMessage = {
    sender: 'bot',
    text: `Hey there! 👋 I'm Shocker's Budtender, powered by Professor Shocker. I'm your personal cannabis concierge AND your cannabis educator. Ask me about strains, terpenes, effects, consumption methods, recipes, Florida med cards, compliance rules, dispensary loyalty programs, or anything cannabis-related. What can I help you with today?`,
  };

  // ── CHECK FOR WEB SPEECH API SUPPORT ON MOUNT ───────────────
  // Run once when the component first loads. If the browser supports
  // SpeechRecognition, set speechSupported to true so the mic button shows.
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  // ── SHOW WELCOME MESSAGE WHEN CHAT FIRST OPENS ──────────────
  // This runs when isOpen changes. If the chat is opened and
  // there are no messages yet, we add the welcome message.
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([welcomeMessage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ── AUTO-SCROLL TO NEWEST MESSAGE ───────────────────────────
  // Every time messages change, scroll to the bottom so the
  // customer always sees the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── CLEANUP: STOP RECOGNITION IF CHAT CLOSES ────────────────
  // If the user closes the chat while the mic is active, stop it.
  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ── TOGGLE CHAT OPEN/CLOSED ─────────────────────────────────
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // ── HANDLE TYPING IN THE INPUT BOX ──────────────────────────
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // ── SEND MESSAGE TO THE AI ──────────────────────────────────
  // This is the main function that runs when the user hits Send.
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Don't send empty messages
    if (inputMessage.trim() === '') return;

    // If mic is still listening, stop it before sending
    if (isListening) {
      stopListening();
    }

    // Add the user's message to the chat immediately
    const userMessage = { sender: 'user', text: inputMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage(''); // Clear the input box
    setIsTyping(true);   // Show "typing..." indicator

    try {
      // Send the message to our Netlify serverless function
      // This function is at /.netlify/functions/chat
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,  // The new message
          history: messages,       // Full conversation history for context
        }),
      });

      // If something went wrong with the request
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the AI's reply and add it to the chat
      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: data.reply },
      ]);
    } catch (error) {
      // If there's an error, show a friendly message instead of crashing
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Oops! I'm having a little trouble right now. Please try again in a moment." },
      ]);
    } finally {
      // Hide the typing indicator whether it worked or not
      setIsTyping(false);
    }
  };

  // ── START VOICE RECOGNITION ─────────────────────────────────
  // Called when the user clicks the mic button while NOT listening.
  // Creates a SpeechRecognition instance, configures it, and starts it.
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return; // Safety check

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';          // Recognize English
    recognition.interimResults = true;   // Show partial results as user speaks
    recognition.maxAlternatives = 1;     // Only need the top result
    recognition.continuous = false;      // Stop after one utterance

    // ── SPEECH RESULT HANDLER ──────────────────────────────────
    // Fires as the user speaks. We grab the most confident transcript
    // and put it in the input field. Once the result is "final"
    // (isFinal === true), the user can review and hit Send.
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      // Put the recognized text into the input field
      setInputMessage(transcript);
    };

    // ── RECOGNITION ENDED ──────────────────────────────────────
    // Fires when recognition stops (either naturally or via stopListening).
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    // ── RECOGNITION ERROR ──────────────────────────────────────
    // Fires if there's a mic permission error, no speech detected, etc.
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      recognitionRef.current = null;
    };

    // Store the instance so we can stop it later, then start listening
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // ── STOP VOICE RECOGNITION ──────────────────────────────────
  // Called when the user clicks the mic button while already listening,
  // or when the chat closes, or before sending a message.
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // ── TOGGLE MIC ON/OFF ───────────────────────────────────────
  // Single handler for the mic button click — starts or stops listening.
  const handleMicClick = (e) => {
    e.preventDefault(); // Don't submit the form
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // ── RENDER THE WIDGET ───────────────────────────────────────
  return (
    <div className="chat-widget-container">
      {/* The floating bubble button — only visible when chat is closed */}
      <div
        className={`chat-bubble ${isOpen ? 'hidden' : ''}`}
        onClick={toggleChat}
        title="Chat with Shocker's Budtender"
      >
        {/* Cannabis leaf emoji as the bubble icon */}
        🌿
      </div>

      {/* The chat window — slides up when opened */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        {/* Header bar with name and close button */}
        <div className="chat-header">
          <h3>🌿 {botName}</h3>
          <button className="close-button" onClick={toggleChat}>
            &times;
          </button>
        </div>

        {/* Messages area — scrollable */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          {/* Typing indicator — shows when waiting for AI response */}
          {isTyping && (
            <div className="message bot typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
          {/* Invisible element we scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* ── INPUT FORM ─────────────────────────────────────────
            Contains the text input, optional mic button, and Send button.
            The mic button only renders if the browser supports the
            Web Speech API (speechSupported === true).
        ─────────────────────────────────────────────────────── */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Ask about strains, med cards, loyalty programs..."
            value={inputMessage}
            onChange={handleInputChange}
          />

          {/* Mic button — hidden if browser doesn't support speech recognition */}
          {speechSupported && (
            <button
              type="button"
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={handleMicClick}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            >
              {/* Microphone SVG icon — switches to a stop icon while listening */}
              {isListening ? (
                // Stop icon (square) shown while actively listening
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                </svg>
              ) : (
                // Microphone icon shown when idle
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                  <path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V20H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-3.08A7 7 0 0 0 19 10z" />
                </svg>
              )}
            </button>
          )}

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
