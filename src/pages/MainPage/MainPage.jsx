import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import NavBar2 from '../../components/NavBar2/NavBar2';
import Mapa from '../../components/Mapa/Mapa';
import NightMode from '../../components/NightMode/NightMode';
import axios from 'axios';
import URL_BACK from '../../../config';
import geolib from 'geolib';

const MainPage = () => {
    const location = useLocation();
    const email = location.state?.email || '';
    const navigate = useNavigate();

    const [nightMode, setNightMode] = useState(() => {
        const storedValue = localStorage.getItem('nightMode');
        return storedValue ? JSON.parse(storedValue) : false;
    });

    const [searchResults, setSearchResults] = useState([]);
    const [searchAddress, setSearchAddress] = useState('');
    const [mapCoordinates, setMapCoordinates] = useState(null);

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

                const results = users.map(user => {
                    return {
                        name: user.name,
                        direccion: user.address,
                        productos: ingredients.filter(ingredient => ingredient.owner === user.email).map(ingredient => ingredient.name),
                        email: user.email,
                        coordinates: { latitude: user.lat, longitude: user.lon } // Ajoute les coordonnées ici
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

    const handleFridgeClick = (email) => {
        navigate('/OtherFridge', { state: { email } });
    };

    const handleSearchChange = (event) => {
        setSearchAddress(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
    
        try {
            if (!searchAddress) {
                console.log('Adresse vide');
                return;
            }
    
            console.log('Recherche en cours pour :', searchAddress);
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${searchAddress}&format=json`);
            console.log('Réponse de la recherche :', response);
    
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                console.log('Coordonnées trouvées :', { lat, lon });
                setMapCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
    
                // Calcul des distances par rapport à l'adresse recherchée
                const sortedResults = searchResults.map(result => ({
                    ...result,
                    distance: geolib.getDistance(
                        { latitude: parseFloat(lat), longitude: parseFloat(lon) },
                        { latitude: parseFloat(result.coordinates.latitude), longitude: parseFloat(result.coordinates.longitude) }
                    )
                })).sort((a, b) => a.distance - b.distance);
    
                setSearchResults(sortedResults);
            } else {
                console.log('Adresse non trouvée');
                setMapCoordinates(null);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            setMapCoordinates(null);
            setSearchResults([]);
        }
    };
    

    return (
        <div className={nightMode ? 'dark-mode' : ''}>
            <NavBar2 />
            <h1>¡Bienvenido {email}!</h1>
            <div className="d-flex justify-content-center align-items-start">
                <NightMode nightMode={nightMode} toggleNightMode={toggleNightMode} />
                <Mapa height="400px" width="100%" coordinates={mapCoordinates} />
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
                                        <td onClick={() => handleProfileClick(result.email)} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
                                            {result.name}
                                        </td>
                                        <td>{result.direccion}</td>
                                        <td>{result.productos.join(', ')}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleFridgeClick(result.email)}>Cehck My Fridge !</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="form-container">
                <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                    <input className="form-control me-2" type="search" placeholder="Search a place" aria-label="Search" value={searchAddress} onChange={handleSearchChange} />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    );
};

export default MainPage;
