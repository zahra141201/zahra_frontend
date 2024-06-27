import React from 'react';
import './NavBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import icono_navbar from '../../components/imagenes/icono_navbar.jpeg'; // Importar la imagen del icono

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <a className="navbar-brand" href="/">
        <img src={icono_navbar} alt="Icono_navbar" className="icono_navbar"/> {/* Mostrar la imagen del icono */}
      </a>
      {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button> */}
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {/* <li className="nav-item active">
            <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
          </li> */}
          <li className="nav-item">
            <a className="nav-link" href="/AboutusPage">ABOUT US</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/DocsPage">INSTRUCTIONS</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/signup">SIGN UP</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/login">LOG IN</a>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link disabled" href="#">Disabled</a>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;

