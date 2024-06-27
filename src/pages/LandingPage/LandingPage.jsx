import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import NavBar from '../../components/NavBar/NavBar';
import icono from '../../components/imagenes/icono.jpeg'; // Importar la imagen

const LandingPage = () => {
  const [count, setCount] = useState(() => {
    // Obtener el valor del contador desde localStorage al cargar el componente
    const savedCount = localStorage.getItem('count');
    return savedCount !== null ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    // Guardar el valor del contador en localStorage cada vez que cambie
    localStorage.setItem('count', count);
  }, [count]);

  return (
    <div className='container-fluid p-0 landing-page'>
      <NavBar />
      <div className="row justify-content-center align-items-center">
        <div className="col text-center">
          <h1 className="mt-5">Bienvenidos a SalvaComida</h1>
          <img src={icono} alt="Icono" className="icono" />
          <p className="descripcion">
            Conectando sabores y cuidando el planeta:<br/>
            Únete a nuestra comunidad para comprar, vender y compartir ingredientes frescos y locales,<br/>
            reduciendo el desperdicio alimentario y promoviendo una gastronomía responsable.
          </p>
          <button className="btn-custom" onClick={() => setCount((count) => count + 1)}>
            Personas que apoyan la idea ❤ : {count}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;











