import React from 'react';
import './Mapa.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Mapa = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.104105476687!2d-70.61595778936056!3d-33.498668473259386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d00eab4e9d4d%3A0x420f55d3226bf853!2sPontificia%20Universidad%20Cat%C3%B3lica%20de%20Chile%20-%20Campus%20San%20Joaqu%C3%ADn!5e0!3m2!1ses!2scl!4v1717199410425!5m2!1ses!2scl"
      width="600"
      height="450"
      style={{ border: 0 }}
      allowFullScreen="" // Usar el formato camelCase correcto
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade" // Usar el formato camelCase correcto
    ></iframe>
  );
};

export default Mapa;
