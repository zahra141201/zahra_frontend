import React from 'react';
import './NightMode.css';

const NightMode = ({ nightMode, toggleNightMode }) => {
    return (
        <div className={`night-mode-container ${nightMode ? 'night-mode-on' : 'night-mode-off'}`} onClick={toggleNightMode}>
            <div className="switch"></div>
            <span className="mode-label">Dark Mode</span>
        </div>
    );
};

export default NightMode;


