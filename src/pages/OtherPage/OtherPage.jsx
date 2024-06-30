import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import URL_BACK from '../../../config';
import NavBar2 from '../../components/NavBar2/NavBar2';
import './OtherPage.css'; // Assurez-vous d'avoir votre fichier CSS pour le style

function OtherProfile() {
  const [user, setUser] = useState(null);
  const [hasLink, setHasLink] = useState(false);
  const [rating, setRating] = useState(0); // État pour la notation par étoiles
  const [comment, setComment] = useState(''); // État pour le commentaire
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
            const ingredientResponse = await axios.get(`${URL_BACK}/ingredients/${request.id_ingrediente}`, {
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

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitRating = async () => {
    try {
      const loggedInEmail = localStorage.getItem('email');
      const profileEmail = user.email; // Assuming user is fetched and available

      const response = await axios.post(`${URL_BACK}/valorations`, {
        comment,
        puntuation: rating,
        email_user: profileEmail,
        made_by: loggedInEmail
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        alert('Rating submitted successfully!');
        // Optionally, you can update UI or handle success as needed
      } else {
        alert('Failed to submit rating:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
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
                  {/* Rating stars */}
                  <div className="rating-stars">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={index < rating ? 'filled' : 'empty'}
                        onClick={() => handleRatingChange(index + 1)}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                  {/* Comment input */}
                  <div>
                    <label htmlFor="comment">Comment:</label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={comment}
                      onChange={handleCommentChange}
                      rows={4}
                      cols={50}
                    />
                  </div>
                  {/* Submit button */}
                  <button onClick={handleSubmitRating}>Submit Rating</button>
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
