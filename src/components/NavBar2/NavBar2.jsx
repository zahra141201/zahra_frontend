import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../NavBar/NavBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import icono_navbar from '../../components/imagenes/icono_navbar.jpeg';
import URL_BACK from '../../../config';

const NavBar2 = () => {
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      alert("zahra");

      // Récupérer le token depuis le localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        alert("coucou");
        const response = await axios.get(`${URL_BACK}users/login/token`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          
          const emaildelete = response.data.email;
          alert(emaildelete);

          // Utilisez la bonne URL avec /deleteByEmail
          const deleteResponse = await axios.delete(`${URL_BACK}users/deleteByEmail/${emaildelete}`);
          if (deleteResponse.status === 204) {
            // Déconnexion de l'utilisateur après la suppression
            handleLogout();
          }
        } else {
          alert('Failed to fetch user email:', response.statusText);
        }
      } catch (error) {
        alert('Error fetching user email:', error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <a className="navbar-brand" href="/">
        <img src={icono_navbar} alt="Icono_navbar" className="icono_navbar"/>
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link to="/mainpage" className="nav-link">Search</Link>
          </li>
          <li className="nav-item">
            <Link to="/MyFridge" className="nav-link">MyFridge</Link>
          </li>
          <li className="nav-item">
            <Link to="/ShoppingCart" className="nav-link">Your Shopping Cart</Link>
          </li>
          <li className="nav-item">
            <Link to="/Profile" className="nav-link">My Profile</Link>
          </li>
          <li className="nav-item">
            <Link to="/valorationspage" className="nav-link">See Ranking</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/" onClick={handleLogoutClick}>Log out</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar2;
