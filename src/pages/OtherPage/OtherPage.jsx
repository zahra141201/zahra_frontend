import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar2 from '../../components/NavBar2/NavBar2';
import URL_BACK from '../../../config';
import './OtherPage.css';

function OtherProfile() {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hasLink, setHasLink] = useState(false);
  const [existingRating, setExistingRating] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('is_admin')
 

  useEffect(() => {
    
    console.log('est ce que c est un admin', isAdmin)
    const fetchUserData = async () => {
      const userEmail = location.state?.email;
      console.log('User email from location state:', userEmail);
      if (!userEmail) return;

      try {
        const response = await axios.get(`${URL_BACK}/users/${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          console.log('User data fetched:', response.data);
          setUser(response.data);
          fetchExistingRating(response.data.email);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [location.state?.email]);

  const fetchExistingRating = async (emailUser) => {
    console.log('Fetching existing rating for user:', emailUser);
    try {
      const response = await axios.get(`${URL_BACK}/valorations`, {
        params: {
          email_user: emailUser,
          made_by: localStorage.getItem('email')
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data) {
        console.log('Existing rating data:', response.data);
        setExistingRating(response.data);
        setRating(response.data.puntuation);
        setComment(response.data.comment);
      }
    } catch (error) {
      console.error('Error fetching existing rating:', error);
    }
  };

  useEffect(() => {
    const checkLink = async (loggedInEmail, profileEmail) => {
      console.log('Checking link for user:', loggedInEmail, 'and profile:', profileEmail);
      try {
        const requestsResponse = await axios.get(`${URL_BACK}/requests/user/${loggedInEmail}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (requestsResponse.status === 200) {
          const requests = requestsResponse.data;
          let foundLink = false;
          console.log('Requests data:', requests);

          for (const request of requests) {
            const ingredientResponse = await axios.get(`${URL_BACK}/ingredientes/${request.id_ingrediente}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            });

            if (ingredientResponse.status === 200) {
              const ingredient = ingredientResponse.data;
              console.log('Ingredient data:', ingredient);
              if (ingredient.owner === profileEmail) {
                foundLink = true;
                break;
              }
            } else {
              console.error('Failed to fetch ingredient:', ingredientResponse.statusText);
            }
          }

          setHasLink(foundLink);
        } else {
          console.error('Failed to fetch requests:', requestsResponse.statusText);
        }
      } catch (error) {
        console.error('Error checking link:', error);
      }
    };

    if (user && location.state?.email) {
      checkLink(localStorage.getItem('email'), location.state.email);
    }
  }, [user, location.state?.email]);

  const handleStarClick = (value) => {
    console.log('Star clicked with value:', value);
    setRating(value);
  };

  const handleSubmitRating = async () => {
    console.log('Submitting rating:', rating, 'with comment:', comment);
    try {
      if (existingRating) {
        console.log('Updating existing rating:', existingRating.id);
        await updateRating(existingRating.id);
      } else {
        console.log('Submitting new rating');
        await submitNewRating();
      }

      // Reset states after submission
      setRating(0);
      setComment('');
      fetchExistingRating(user.email);  // Fetch the updated rating
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const updateRating = async (valorationId) => {
    console.log('Updating rating with id:', valorationId);
    try {
      const patchResponse = await axios.patch(`${URL_BACK}/valorations/${valorationId}`, {
        comment: comment,
        puntuation: rating,
        email_user: user?.email,
        made_by: localStorage.getItem('email')
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Patch Response:', patchResponse);
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const submitNewRating = async () => {
    console.log('Submitting new rating with rating:', rating, 'and comment:', comment);
    try {
      const postResponse = await axios.post(`${URL_BACK}/valorations`, {
        puntuation: rating,
        comment: comment,
        email_user: user?.email,
        made_by: localStorage.getItem('email')
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Post Response:', postResponse);
      if (postResponse.status === 201) {
        fetchExistingRating(user.email);  // Fetch the updated rating
      } else {
        console.error('Failed to submit rating:', postResponse.statusText);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleDeleteRating = async () => {
    console.log('Deleting rating for user:', localStorage.getItem('email'));
    try {
      const deleteResponse = await axios.delete(`${URL_BACK}/valorations/user/${localStorage.getItem('email')}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (deleteResponse.status === 204) {
        setRating(0);
        setComment('');
        setExistingRating(null);
        alert('Rating deleted successfully!');
      } else {
        console.error('Failed to delete rating:', deleteResponse.statusText);
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Error deleting rating:', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    console.log('Deleting account for user:', user.email);
    try {
      const deleteResponse = await axios.delete(`${URL_BACK}/deleteByEmail/${user.email}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (deleteResponse.status === 204) {
        alert('Account deleted successfully!');
        navigate('/mainpage');
      } else {
        console.error('Failed to delete account:', deleteResponse.statusText);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account:', error.message);
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
                  {isAdmin === 'true' && (
  <button onClick={handleDeleteAccount} className="btn btn-danger mt-3">Delete Account</button>
)}

                  {hasLink && (
                    <div>
                      <p><strong>Link:</strong> Yes</p>
                      <div>
                        <p><strong>Rate:</strong></p>
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
                        {existingRating && <button onClick={handleDeleteRating}>Delete Rating</button>}
                     
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
