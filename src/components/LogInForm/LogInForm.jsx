import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LogInForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import URL_BACK from '../../../config';
import { AuthContext } from '../../auth/AuthContext';

const LogInForm = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(() => {
    const savedVisibility = localStorage.getItem('loginPasswordVisible');
    return savedVisibility !== null ? JSON.parse(savedVisibility) : false;
  });
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');

  const togglePasswordVisibility = () => {
    const newVisibility = !passwordVisible;
    setPasswordVisible(newVisibility);
    localStorage.setItem('loginPasswordVisible', JSON.stringify(newVisibility));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("apretaste el form");

    axios.post(`${URL_BACK}/login`, {
      email,
      password
    }).then((response) => {
      console.log("bloque then");
      setError(false);
      setMsg(`¡Bienvenido ${email}!`);

      const access_token = response.data.access_token;
      const user = response.data.user; // Obtenez les informations de l'utilisateur depuis la réponse
      setToken(access_token);

      localStorage.setItem('email', user.email);
      localStorage.setItem('is_admin', user.is_admin); // Assurez-vous que l'information d'admin est incluse dans la réponse

      console.log(response);

      // Rediriger à la page principale et passer l'email
      navigate('/mainpage', { state: { email: user.email } });

    }).catch((error) => {
      console.log("bloque catch");
      setError(true);
      console.log(error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className='container-signUPform'>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">E-mail:</span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="example@gmail.com" 
          aria-label="E-mail" 
          aria-describedby="basic-addon1" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
      <div className="text-center">
        <button className="btn btn-custom" type="submit">Enviar</button>
      </div>
    </form>
  );
};

export default LogInForm;
