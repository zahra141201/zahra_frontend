import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css'; // Importe le fichier CSS avec les styles ajoutés
import NavBar2 from '../../components/NavBar2/NavBar2';
import Mapa from '../../components/Mapa/Mapa';
import NightMode from '../../components/NightMode/NightMode';
import axios from 'axios';
import URL_BACK from '../../../config';
import geolib from 'geolib';

const MainPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    const [nightMode, setNightMode] = useState(() => {
        const storedValue = localStorage.getItem('nightMode');
        return storedValue ? JSON.parse(storedValue) : false;
    });

    const [searchResults, setSearchResults] = useState([]);
    const [searchAddress, setSearchAddress] = useState('');
    const [mapCoordinates, setMapCoordinates] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [searchedLocation, setSearchedLocation] = useState(null);

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

                const users = usersResponse.data.filter(user => user.email !== email); // Filter out current user
                const ingredients = ingredientsResponse.data.filter(ingredient => ingredient.owner !== email); // Filter out ingredients owned by current user

                console.log('Users data:', users);
                console.log('Ingredients data:', ingredients);

                const promises = users.map(async (user) => {
                    const address = user.address;
                    const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
                    const { lat, lon } = response.data[0];

                    return {
                        ...user,
                        coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
                        productos: ingredients
                            .filter(ingredient => ingredient.owner === user.email)
                            .map(ingredient => ingredient.name)
                    };
                });

                const results = await Promise.all(promises);
                setSearchResults(results);
                setMarkers(results.map(result => ({ lat: result.coordinates.latitude, lon: result.coordinates.longitude })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserLocation({ lat: latitude, lon: longitude });
                        // Only set map coordinates initially when user location is fetched
                        if (!mapCoordinates) {
                            setMapCoordinates({ lat: latitude, lon: longitude });
                        }
                    },
                    (error) => {
                        console.error('Error fetching user location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        fetchData();
        fetchUserLocation();
    }, [email]); // Include email in dependencies to fetch new data when email changes

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
                const { lat, lon, display_name } = response.data[0];
                console.log('Coordonnées trouvées :', { lat, lon });
                setMapCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
                setSearchedLocation({ lat: parseFloat(lat), lon: parseFloat(lon), name: display_name });

                const sortedResults = searchResults.map(result => ({
                    ...result,
                    distance: geolib.getDistance(
                        { latitude: parseFloat(lat), longitude: parseFloat(lon) },
                        { latitude: parseFloat(result.coordinates.latitude), longitude: parseFloat(result.coordinates.longitude) }
                    )
                })).sort((a, b) => a.distance - b.distance);

                setSearchResults(sortedResults);
                // Clear user location marker when searching for an address
                setUserLocation(null);
            } else {
                console.log('Adresse non trouvée');
                setMapCoordinates(null);
                setSearchResults([]);
                // Clear user location marker when searching for an address
                setUserLocation(null);
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            setMapCoordinates(null);
            setSearchResults([]);
            // Clear user location marker when searching for an address
            setUserLocation(null);
        }
    };

    return (
        <div className={`main-container ${nightMode ? 'dark-mode' : ''}`}>
            <NavBar2 />
            <h1 className="header">¡Bienvenido {email}!</h1>
            <NightMode nightMode={nightMode} toggleNightMode={toggleNightMode} />
            <div className="map-container">
                <Mapa height="400px" width="100%" coordinates={mapCoordinates} markers={markers} userLocation={userLocation} searchedLocation={searchedLocation} currentUserEmail={email} />
            </div>
            <div className="search-container">
                <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                    <input className="form-control me-2" type="search" placeholder="Search a place" aria-label="Search" value={searchAddress} onChange={handleSearchChange} />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
            <div className="results-container">
                <table className="results-table">
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
                                <td onClick={() => handleProfileClick(result.email)}>{result.name}</td>
                                <td>{result.address}</td>
                                <td>{result.productos ? result.productos.join(', ') : '-'}</td>
                                <td><button className="btn btn-primary" onClick={() => handleFridgeClick(result.email)}>Check My Fridge!</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MainPage;
