import React, { useState } from 'react';
    
    // Simple inline styles
    const styles = {
      container: { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
        maxWidth: '700px', 
        margin: '50px auto', 
        padding: '30px', 
        backgroundColor: '#f9f9f9',
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
      },
      title: { 
        color: '#333',
        borderBottom: '2px solid #eee',
        paddingBottom: '10px'
      },
      buttonContainer: {
        display: 'flex',
        gap: '10px',
        margin: '20px 0'
      },
      button: { 
        padding: '12px 18px', 
        fontSize: '16px', 
        cursor: 'pointer', 
        borderRadius: '8px', 
        border: 'none',
        color: 'white',
        fontWeight: '500',
        transition: 'transform 0.2s'
      },
      pingButton: { backgroundColor: '#007bff' },
      addButton: { backgroundColor: '#28a745' },
      getButton: { backgroundColor: '#ffc107', color: '#333' },
      output: { 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        minHeight: '100px', 
        border: '1px solid #eee',
        whiteSpace: 'pre-wrap', 
        wordBreak: 'break-all',
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.6'
      }
    };
    
    function App() {
      const [output, setOutput] = useState('Click a button to test your full stack!');
    
      /**
       * Calls the /api/ping endpoint.
       * All API calls are relative URLs (e.g., /api/ping).
       * On Vercel, this automatically routes to your serverless function.
       */
      const pingBackend = async () => {
        setOutput('Pinging backend...');
        try {
          const res = await fetch('/api/ping');
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          setOutput(JSON.stringify(data, null, 2));
        } catch (e) {
          setOutput(`Error pinging backend: ${e.message}`);
        }
      };
    
      /**
       * Calls the /api/add-item endpoint with a new item.
       */
      const addItem = async () => {
        const itemName = `TestItem-${Date.now()}`;
        setOutput(`Adding item: ${itemName}...`);
        try {
          const res = await fetch('/api/add-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: itemName })
          });
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          setOutput(JSON.stringify(data, null, 2));
        } catch (e) {
          setOutput(`Error adding item: ${e.message}`);
        }
      };
    
      /**
       * Calls the /api/get-latest-item endpoint.
       */
      const getLatestItem = async () => {
        setOutput('Getting latest item from DB...');
        try {
          const res = await fetch('/api/get-latest-item');
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          setOutput(JSON.stringify(data, null, 2));
        } catch (e) {
          setOutput(`Error getting item: ${e.message}`);
        }
      };
    
      return (
        <div style={styles.container}>
          <h1 style={styles.title}>React + FastAPI + MongoDB Test App</h1>
          <p>
            This app tests the full stack. The React frontend (served by Vercel)
            calls the FastAPI Serverless Functions (also on Vercel),
            which then connect to your MongoDB Atlas database.
          </p>
          <div style={styles.buttonContainer}>
            <button 
              style={{...styles.button, ...styles.pingButton}} 
              onClick={pingBackend}
            >
              1. Ping FastAPI
            </button>
            <button 
              style={{...styles.button, ...styles.addButton}} 
              onClick={addItem}
            >
              2. Add Item to DB
            </button>
            <button 
              style={{...styles.button, ...styles.getButton}} 
              onClick={getLatestItem}
            >
              3. Get Latest Item
            </button>
          </div>
          <div style={styles.output}>
            <pre>{output}</pre>
          </div>
        </div>
      );
    }
    
    export default App;