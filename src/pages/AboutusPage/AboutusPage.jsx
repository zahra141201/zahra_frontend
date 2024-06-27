import React from 'react';
import './AboutusPage.css';
import NavBar from '../../components/NavBar/NavBar';
import javiImage from '../../components/imagenes/javi.png';
import rominaImage from '../../components/imagenes/romina.png';
import zahraImage from '../../components/imagenes/zahra.png';


const AboutusPage = () => {
  return (
    <div className='container-fluid p-0 landing-page'>
      <NavBar />

      <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
          <div className="col text-center">

          <h1 className="mt-5">About Us !</h1>

            <div className="d-flex justify-content-around"> {/* Utiliser la classe d-flex pour aligner les cartes horizontalement */}

        

              <div className="card1">
                <img src={javiImage} alt="Nom de la personne" />
                <p>Javi</p>
              </div>

              <div className="card2">
                <img src={rominaImage} alt="Nom de la personne" />
                <p>Romina</p>
              </div>

              <div className="card3">
                <img src={zahraImage} alt="Nom de la personne" />
                <p>Zahra</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutusPage;


