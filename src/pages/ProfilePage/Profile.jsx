import React, { useEffect, useState } from 'react';
import axios from 'axios';
import URL_BACK from '../../../config';
import NavBar2 from '../../components/NavBar2/NavBar2';
import './Profile.css'; // Supposant que vous avez du CSS pour le style

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        return;
      }

      try {
        const response = await axios.get(`${URL_BACK}/users/email/${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          setUser(response.data);
          setUpdatedUser(response.data); // Initialise updatedUser avec les données de l'utilisateur
        } else {
          alert('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        alert('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

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
        alert('Failed to update user data:', response.statusText);
      }
    } catch (error) {
      alert('Error updating user data:', error);
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
                      <input type="text" name="adress" value={updatedUser.adress} onChange={handleInputChange} />
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
                    <p><strong>Address:</strong> {user.adress}</p>
                    <p><strong>Description:</strong> {user.description}</p>
                    <p><strong>Admin:</strong> {user.is_admin ? 'Yes' : 'No'}</p>
                    <button onClick={handleModifyClick} className="btn btn-secondary">Modify</button>
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
