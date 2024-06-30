import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import URL_BACK from '../../../config';
import NavBar2 from '../../components/NavBar2/NavBar2';
import './OtherPage.css'; // Assurez-vous d'avoir votre fichier CSS pour le style

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
          alert('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        alert('Error fetching user data:', error);
      }
    };

    const checkLink = async (loggedInEmail, profileEmail) => {
      try {
        // Step 1: Fetch requests made by the logged-in user
        const requestsResponse = await axios.get(`${URL_BACK}/requests/user/${loggedInEmail}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (requestsResponse.status === 200) {
          const requests = requestsResponse.data;

          // Step 2: Check each request to see if it links to the profile user
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
                break; // No need to check further if we already found a link
              }
            }
          }
        } else {
          console.error('Failed to fetch requests:', requestsResponse.statusText);
        }
      } catch (error) {
        console.error('Error checking link:', error);
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
      // Vérifier s'il existe déjà une valorisation faite par l'utilisateur connecté pour l'utilisateur visité
      const existingValorationResponse = await axios.get(`${URL_BACK}/valorations`, {
        params: {
          email_user: user.email,
          made_by: localStorage.getItem('email')
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
  
      alert('User valorations: ' + JSON.stringify(existingValorationResponse));
  
      if (existingValorationResponse.status === 200 && existingValorationResponse.data && existingValorationResponse.data.length > 0) {
        // S'il existe déjà une valorisation, effectuer un PATCH
        const existingValorationId = existingValorationResponse.data[0].id;
        const patchResponse = await axios.patch(`${URL_BACK}/valorations/${existingValorationId}`, {
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
  
        console.log('Patch Response:', patchResponse);
        alert('Rating updated successfully!');
      } else {
        // S'il n'existe pas de valorisation, effectuer un POST pour créer une nouvelle valorisation
        const postResponse = await axios.post(`${URL_BACK}/valorations`, {
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
  
        console.log('Post Response:', postResponse);
        if (postResponse.status === 201) {
          alert('Rating submitted successfully!');
        } else {
          alert('Failed to submit rating:', postResponse.statusText);
        }
      }
  
      // Réinitialiser les états après soumission si nécessaire
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating:', error.message);
    }
  };
  

  return (
    <div className='container-fluid p-0 landing-page'>
      <NavBar2 />
      <div className="container mt-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-8 col-lg-6 text-center">
            <h1 className="mt-5">User Profile</h1>
            <div className="user-info">
              {user ? (
                <div className="user-details">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Telephone:</strong> {user.telephone}</p>
                  <p><strong>Member Since:</strong> {new Date(user.member_since).toLocaleDateString()}</p>
                  <p><strong>Address:</strong> {user.address}</p>
                  <p><strong>Description:</strong> {user.description}</p>
                  <p><strong>Admin:</strong> {user.is_admin ? 'Yes' : 'No'}</p>
                  {hasLink && (
                    <div>
                      <p><strong>Link:</strong> Oui</p>
                      <div>
                        <p><strong>Rate:</strong></p>
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
                          placeholder="Add a comment..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <button onClick={handleSubmitRating}>Submit Rating</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>Loading user data...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;
