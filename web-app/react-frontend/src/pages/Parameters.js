import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, AlertCircle } from 'lucide-react';
import './Parameters.css';

const Parameters = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="parameters">
      <div className="calculator-fullscreen">
        {!iframeLoaded && !iframeError && (
          <div className="iframe-loading">
            <div className="loading-spinner"></div>
            <p>Loading Calculator...</p>
          </div>
        )}
        
        {iframeError && (
          <div className="iframe-error">
            <AlertCircle size={48} />
            <h3>Calculator Unavailable</h3>
            <p>Unable to load the calculator. Please try opening it in a new tab.</p>
            <button 
              className="retry-button"
              onClick={() => window.open('https://calcutor-topaz.vercel.app/', '_blank')}
            >
              Open Calculator
            </button>
          </div>
        )}
        
        <iframe
          src="https://calcutor-topaz.vercel.app/"
          title="Parameter Calculator"
          className="calculator-iframe-fullscreen"
          frameBorder="0"
          allowFullScreen
          loading="eager"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeError(true)}
          style={{ display: iframeLoaded ? 'block' : 'none' }}
        />
        
        <motion.button
          className="calculator-button-floating"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open('https://calcutor-topaz.vercel.app/', '_blank')}
        >
          <Calculator size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default Parameters;
