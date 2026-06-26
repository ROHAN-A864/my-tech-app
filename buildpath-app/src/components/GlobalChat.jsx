import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, push, set, onValue, serverTimestamp } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const GlobalChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);
  
  const auth = getAuth();
  const db = getDatabase();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const chatRef = ref(db, 'global_chat');
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [db]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const chatRef = ref(db, 'global_chat');
    const newCommentRef = push(chatRef);

    await set(newCommentRef, {
      text: newMessage,
      uid: currentUser.uid,
      displayName: currentUser.displayName || 'Hacker Guest',
      photoURL: currentUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg',
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
      backgroundColor: '#0e1815',
      border: '1px solid #163029',
      borderRadius: '16px',
      overflow: 'hidden',
      marginTop: '20px',
      boxShadow: '0 0 20px rgba(63, 255, 158, 0.05)',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      {/* Dynamic Keyframe Injection for Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', backgroundColor: '#0b1412', padding: '15px 20px', borderBottom: '1px solid #163029' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#39ff9e', animation: 'pulseGlow 1.5s infinite' }}></span>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#39ff9e', letterSpacing: '1px' }}>⚡ LIVE GLOBAL MATRIX CHAT</h3>
        </div>
        <span style={{ fontSize: '12px', color: '#688c80' }}>{messages.length} Nodes Connected</span>
      </div>

      {/* Messages Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.length === 0 ? (
          <div style={{ color: '#688c80', fontSize: '12px', textAlign: 'center', marginTop: '40px' }}>[ System: Waiting for initial transmission... Type below, bhai! ]</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.uid === currentUser?.uid;
            return (
              <div key={msg.id} style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                flexDirection: isMe ? 'row-reverse' : 'row',
                animation: 'slideIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards'
              }}>
                <img src={msg.photoURL} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${isMe ? '#39ff9e' : '#163029'}`, backgroundColor: '#0b1412' }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: '10px', color: isMe ? '#39ff9e' : '#688c80', marginBottom: '4px', fontWeight: 'bold' }}>
                    {msg.displayName} {isMe && '(You)'}
                  </span>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: '#cfe9de',
                    backgroundColor: isMe ? '#163029' : '#0b1412',
                    border: `1px solid ${isMe ? '#39ff9e' : '#163029'}`,
                    boxShadow: isMe ? '0 0 10px rgba(57, 255, 158, 0.1)' : 'none',
                    maxWidth: '300px',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', padding: '15px 20px', backgroundColor: '#0b1412', borderTop: '1px solid #163029' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter transmission data, bhai..."
          style={{
            flex: 1,
            backgroundColor: '#0e1815',
            border: '1px solid #163029',
            borderRadius: '8px',
            padding: '12px',
            color: '#39ff9e',
            fontSize: '13px',
            fontFamily: 'monospace',
            outline: 'none',
            transition: 'all 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#39ff9e'}
          onBlur={(e) => e.target.style.borderColor = '#163029'}
        />
        <button type="submit" style={{
          backgroundColor: '#39ff9e',
          color: '#0e1815',
          border: 'none',
          borderRadius: '8px',
          padding: '0 24px',
          fontSize: '13px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontFamily: 'monospace',
          transition: 'all 0.2s',
          boxShadow: '0 0 10px rgba(57, 255, 158, 0.3)'
        }}
        onMouseOver={(e) => e.target.style.opacity = '0.9'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          SEND //
        </button>
      </form>
    </div>
  );
};

export default GlobalChat;