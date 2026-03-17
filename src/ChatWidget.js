// ============================================================
// ChatWidget.js — Shocker's Budtender Chat Widget
// ============================================================
// This component creates a floating chat bubble in the bottom-right
// corner of your website. When a customer clicks it, a chat window
// opens where they can talk to Shocker's Budtender AI.
//
// How it works:
// 1. Customer clicks the chat bubble
// 2. A welcome message appears from the Budtender
// 3. Customer types a message and hits Send
// 4. The message is sent to your Netlify serverless function
// 5. The function talks to OpenAI and sends back a reply
// 6. The reply appears in the chat window
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
  // This ref lets us auto-scroll to the newest message
  const messagesEndRef = useRef(null);

  // ── BUDTENDER NAME & WELCOME MESSAGE ────────────────────────
  const botName = "Shocker's Budtender";
  const welcomeMessage = {
    sender: 'bot',
    text: `Hey there! 👋 I'm ${botName}, your personal cannabis concierge. I can help you find the perfect strain based on the effects, flavors, and strength you're looking for. What are you in the mood for today?`,
  };

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

        {/* Input form at the bottom */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Ask me about strains, effects, terpenes..."
            value={inputMessage}
            onChange={handleInputChange}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
