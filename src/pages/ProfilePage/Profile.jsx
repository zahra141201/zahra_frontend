import React, { useEffect, useState } from 'react';
import axios from 'axios';
import URL_BACK from '../../../config';
import NavBar2 from '../../components/NavBar2/NavBar2';
import './Profile.css'; // Supposant que vous avez du CSS pour le style

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [valorations, setValorations] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const userEmail = localStorage.getItem('email');
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
          setUpdatedUser(response.data); // Initialise updatedUser avec les données de l'utilisateur
          fetchValorations(userEmail);
        } else {
         
        }
      } catch (error) {
       
      }
    };

    fetchUser();
  }, []);

  const fetchValorations = async (email) => {
    try {
      const response = await axios.get(`${URL_BACK}/valorations/${email}`);
      setValorations(response.data);

      // Calcul de la moyenne des points (puntuation)
      const totalPoints = response.data.reduce((sum, valoration) => sum + valoration.puntuation, 0);
      const average = totalPoints / response.data.length;
      setAverageRating(average.toFixed(1)); // Arrondi à une décimale
    } catch (error) {
      console.error('Error fetching valorations:', error);
    
    }
  };

  const handleDeleteUser = async () => {
    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        return;
      }

      const deleteResponse = await axios.delete(`${URL_BACK}/users/deleteByEmail/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (deleteResponse.status === 204) {
        handleLogout();
      }
    } catch (error) {
      
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleUploadClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${URL_BACK}/users/${user.id}`, updatedUser, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setUser(updatedUser); // Met à jour l'état utilisateur avec les nouvelles données
        setIsEditing(false); // Sortir du mode édition
      } else {
       
      }
    } catch (error) {
    
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
                isEditing ? (
                  <div className="user-details">
                    <p>
                      <strong>Email:</strong>
                      <input type="text" name="email" value={updatedUser.email} onChange={handleInputChange} />
                    </p>
                    <p>
                      <strong>Name:</strong>
                      <input type="text" name="name" value={updatedUser.name} onChange={handleInputChange} />
                    </p>
                    <p>
                      <strong>Telephone:</strong>
                      <input type="text" name="telephone" value={updatedUser.telephone} onChange={handleInputChange} />
                    </p>
                    <p>
                      <strong>Member Since:</strong> {new Date(user.member_since).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Address:</strong>
                      <input type="text" name="address" value={updatedUser.address} onChange={handleInputChange} />
                    </p>
                    <p>
                      <strong>Description:</strong>
                      <input type="text" name="description" value={updatedUser.description} onChange={handleInputChange} />
                    </p>
                    <p>
                      <strong>Admin:</strong> {user.is_admin ? 'Yes' : 'No'}
                    </p>
                    <button onClick={handleUploadClick} className="btn btn-primary">Upload</button>
                  </div>
                ) : (
                  <div className="user-details">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Telephone:</strong> {user.telephone}</p>
                    <p><strong>Member Since:</strong> {new Date(user.member_since).toLocaleDateString()}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <p><strong>Description:</strong> {user.description}</p>
                    <p><strong>Admin:</strong> {user.is_admin ? 'Yes' : 'No'}</p>
                    <p><strong>Average Rating:</strong> {averageRating !== 0 && averageRating !== null ? averageRating : 'No grade yet!'}</p>
                    <button onClick={handleModifyClick} className="btn btn-secondary">Modify</button>
                    <li className="nav-item">
                      <a className="nav-link" href="/" onClick={handleDeleteUser}>Delete My Account</a>
                    </li>
                  </div>
                )
              ) : (
                <div>Log in to see your profile!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
