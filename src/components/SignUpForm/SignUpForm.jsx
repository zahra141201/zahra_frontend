import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import URL_BACK from '../../../config';
import { AuthContext } from '../../auth/AuthContext';

const SignUpForm = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(() => {
    const savedVisibility = localStorage.getItem('passwordVisible');
    return savedVisibility !== null ? JSON.parse(savedVisibility) : false;
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const togglePasswordVisibility = () => {
    const newVisibility = !passwordVisible;
    setPasswordVisible(newVisibility);
    localStorage.setItem('passwordVisible', JSON.stringify(newVisibility));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Vérification du mot de passe administrateur
    const isAdmin = adminPassword === 'ABCD';

    axios.post(`${URL_BACK}/signup`, {
      email,
      password,
      name,
      telephone: phone,
      member_since: new Date(),
      address: address,
      description,
      is_admin: isAdmin, // Définir is_admin en fonction de l'adminPassword
    }).then((response) => {
      console.log('Registro exitoso ahora puedes volver y loguearte');
      setError('');
      setMsg('Registro exitoso ahora puedes volver y loguearte');
      navigate('/login');
    }).catch((error) => {
      console.error('Ocurrio un error:', error);
      setError('Ocurrió un error al registrar, por favor intenta de nuevo.');
      setMsg('');
    });
  }

  return (
    <form onSubmit={handleSubmit} className='container-signUPform'>
      {error && <div className="alert alert-danger">{error}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Name:</span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Name" 
          aria-label="Name" 
          aria-describedby="basic-addon1" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">E-mail:</span>
        <input 
          type="email" 
          className="form-control" 
          placeholder="example@gmail.com" 
          aria-label="E-mail" 
          aria-describedby="basic-addon1" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon2">Phone:</span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="+1234567890" 
          aria-label="Phone" 
          aria-describedby="basic-addon2" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon3">Age:</span>
        <input 
          type="number" 
          className="form-control" 
          placeholder="30" 
          aria-label="Age" 
          aria-describedby="basic-addon3" 
          min="0" 
          max="150" 
          step="1" 
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Address:</span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="58 avenida Pocuro, Las Condes" 
          aria-label="Address" 
          aria-describedby="basic-addon1" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text">Description:</span>
        <textarea 
          className="form-control" 
          aria-label="Description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Password</span>
        <input 
          type={passwordVisible ? "text" : "password"} 
          className="form-control" 
          id="floatingPassword" 
          placeholder="password" 
          aria-label="Password" 
          aria-describedby="basic-addon1" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
          {passwordVisible ? '👁' : '👁❌'}
        </span>
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Admin Password</span>
        <input 
          type="password" 
          className="form-control" 
          id="adminPassword" 
          placeholder="Admin Password" 
          aria-label="Admin Password" 
          aria-describedby="basic-addon1" 
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
      </div>
      <div className="text-center">
        <button className="btn btn-custom" type="submit">Enviar</button>
      </div>
    </form>
  );
};

export default SignUpForm;
