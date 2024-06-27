import React from 'react';

const SwitchBox = ({ showFruits, showVegetables, toggleShowFruits, toggleShowVegetables }) => {
    return (
        <div className="form-container" style={{ backgroundColor: "#E0D8D0", padding: "10px", display: "flex", flexDirection: "column", marginLeft: "20px", marginRight: "20px" }}>
            {/* Interruptores para controlar los productos a mostrar */}
            <div className="form-check form-switch" style={{ marginBottom: "10px" }}>
                <input className="form-check-input custom-switch-input" type="checkbox" id="showFruitsSwitch" checked={showFruits} onChange={toggleShowFruits} />
                <label className="form-check-label custom-switch-label" htmlFor="showFruitsSwitch">Show Fruits</label>
            </div>
            <div className="form-check form-switch">
                <input className="form-check-input custom-switch-input" type="checkbox" id="showVegetablesSwitch" checked={showVegetables} onChange={toggleShowVegetables} />
                <label className="form-check-label custom-switch-label" htmlFor="showVegetablesSwitch">Show Vegetables</label>
            </div>
        </div>
    );
};

export default SwitchBox;
