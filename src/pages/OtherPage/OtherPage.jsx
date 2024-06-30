// src/pages/OtherProfile.js

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import NavBar2 from '../../components/NavBar2/NavBar2';
import './OtherPage.css'; // Assurez-vous d'avoir votre fichier CSS pour le style

const URL_BACK = 'http://localhost:3000/api'; // URL de votre backend

function OtherProfile() {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0); // État pour la notation (de 1 à 5)
  const [comment, setComment] = useState(''); // État pour le commentaire
  const [hasLink, setHasLink] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = location.state?.email;
      if (!userEmail) {
        return;
      }

      try {
        const response = await axios.get(`${URL_BACK}/users/${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          setUser(response.data);
          checkLink(localStorage.getItem('email'), userEmail);
        } else {
          alert('Échec de récupération des données utilisateur :', response.statusText);
        }
      } catch (error) {
        alert('Erreur lors de la récupération des données utilisateur :', error);
      }
    };

    const checkLink = async (loggedInEmail, profileEmail) => {
      try {
        // Étape 1 : Récupérer les demandes faites par l'utilisateur connecté
        const requestsResponse = await axios.get(`${URL_BACK}/requests/user/${loggedInEmail}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (requestsResponse.status === 200) {
          const requests = requestsResponse.data;

          // Étape 2 : Vérifier chaque demande pour voir si elle est liée à l'utilisateur de profil
          for (const request of requests) {
            const ingredientResponse = await axios.get(`${URL_BACK}/ingredientes/${request.id_ingrediente}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            });

            if (ingredientResponse.status === 200) {
              const ingredient = ingredientResponse.data;
              if (ingredient.owner === profileEmail) {
                setHasLink(true);
                break; // Pas besoin de vérifier plus loin si nous avons déjà trouvé un lien
              }
            }
          }
        } else {
          console.error('Échec de récupération des demandes :', requestsResponse.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du lien :', error);
      }
    };

    fetchUserData();
  }, [location.state?.email]);

  const handleStarClick = (value) => {
    // Mettre à jour la notation en fonction de la valeur de l'étoile cliquée
    setRating(value);
  };

  const handleSubmitRating = async () => {
    try {
      // Vérifier s'il existe déjà une validation faite par l'utilisateur connecté pour l'utilisateur visité
      const existingValidationResponse = await axios.get(`${URL_BACK}/valorations/${user.email}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (existingValidationResponse.status === 200 && existingValidationResponse.data.length > 0) {
        // S'il existe déjà une validation, effectuer un PATCH
        const existingValidationId = existingValidationResponse.data[0].id;
        await axios.patch(`${URL_BACK}/valorations/${existingValidationId}`, {
          puntuation: rating,
          comment: comment,
          email_user: user.email,
          made_by: localStorage.getItem('email')
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        alert('Évaluation mise à jour avec succès !');
      } else {
        // S'il n'existe pas de validation, effectuer un POST pour créer une nouvelle validation
        const response = await axios.post(`${URL_BACK}/valorations`, {
          puntuation: rating,
          comment: comment,
          email_user: user.email,
          made_by: localStorage.getItem('email')
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          alert('Évaluation soumise avec succès !');
        } else {
          alert('Échec de soumission de l\'évaluation :', response.statusText);
        }
      }

      // Réinitialiser les états après soumission si nécessaire
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'évaluation :', error);
      alert('Erreur lors de la soumission de l\'évaluation :', error.message);
    }
  };

  return (
    <div className='container-fluid p-0 landing-page'>
      <NavBar2 />
      <div className="container mt-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-8 col-lg-6 text-center">
            <h1 className="mt-5">Profil de l'utilisateur</h1>
            <div className="user-info">
              {user ? (
                <div className="user-details">
                  <p><strong>Email :</strong> {user.email}</p>
                  <p><strong>Nom :</strong> {user.name}</p>
                  <p><strong>Téléphone :</strong> {user.telephone}</p>
                  <p><strong>Membre depuis :</strong> {new Date(user.member_since).toLocaleDateString()}</p>
                  <p><strong>Adresse :</strong> {user.address}</p>
                  <p><strong>Description :</strong> {user.description}</p>
                  <p><strong>Admin :</strong> {user.is_admin ? 'Oui' : 'Non'}</p>
                  {hasLink && (
                    <div>
                      <p><strong>Lien :</strong> Oui</p>
                      <div>
                        <p><strong>Note :</strong></p>
                        {/* Affichage des étoiles et gestion des clics */}
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <span
                              key={value}
                              className={value <= rating ? "star filled" : "star"}
                              onClick={() => handleStarClick(value)}
                            >
                              &#9733;
                            </span>
                          ))}
                        </div>
                        <textarea
                          placeholder="Ajouter un commentaire..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <button onClick={handleSubmitRating}>Soumettre l'évaluation</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>Chargement des données utilisateur...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;
