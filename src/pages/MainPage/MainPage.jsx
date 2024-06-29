import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css'; 
import NavBar2 from '../../components/NavBar2/NavBar2';
import Mapa from '../../components/Mapa/Mapa';
import NightMode from '../../components/NightMode/NightMode'; 
import axios from 'axios';
import URL_BACK from '../../../config';

const MainPage = () => {
    const location = useLocation();
    const email = location.state?.email || '';

    const [nightMode, setNightMode] = useState(() => {
        const storedValue = localStorage.getItem('nightMode');
        return storedValue ? JSON.parse(storedValue) : false;
    });

    const [searchResults, setSearchResults] = useState([]);

    const toggleNightMode = () => {
        const newNightMode = !nightMode;
        setNightMode(newNightMode);
        localStorage.setItem('nightMode', JSON.stringify(newNightMode));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, ingredientsResponse] = await Promise.all([
                    axios.get(`${URL_BACK}/users`, {
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          'Content-Type': 'application/json'
                        }
                      }),
                    axios.get(`${URL_BACK}/ingredientes`)
                ]);

                const users = usersResponse.data;
                const ingredients = ingredientsResponse.data;

                // Associer les ingrédients aux utilisateurs
                const results = users.map(user => {
                    return {
                        name: user.name,
                        direccion: user.address,
                        productos: ingredients.filter(ingredient => ingredient.owner === user.email).map(ingredient => ingredient.name),
                        email: user.email
                    };
                });

                setSearchResults(results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleProfileClick = (email) => {
        navigate('/OtherPage', { state: { email } });
    };



    return (
        <div className={nightMode ? "dark-mode" : ""}>
            <NavBar2 />
            <h1>¡Bienvenido {email}!</h1>
            <div className="d-flex justify-content-center align-items-start">
                <NightMode nightMode={nightMode} toggleNightMode={toggleNightMode} />
                <Mapa height="200px" width="300px" className="Mapa" />
                <div className="search-container">
                    <div className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Adresse</th>
                                    <th>Produits</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((result, index) => (
                                    <tr key={index}>
                                        <td>{result.name}</td>
                                        <td>{result.direccion}</td>
                                        <td>{result.productos.join(', ')}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleProfileClick(result.email)}>Voir le profil</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="form-container">
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search a place" aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    );
};

export default MainPage;
