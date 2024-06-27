import React from 'react';
import './ClickCircle.css'; // Importar estilos CSS

function ClickCircle({ isChecked, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`click-circle ${isChecked ? 'checked' : ''}`} // Aplicar la clase "checked" si isChecked es true
        >
            {isChecked && <span>&#10003;</span>}
        </div>
    );
}

export default ClickCircle;

