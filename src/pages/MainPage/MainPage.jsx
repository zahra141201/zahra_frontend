import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css'; 
import NavBar2 from '../../components/NavBar2/NavBar2';
import Mapa from '../../components/Mapa/Mapa';
import SearchCard from '../../components/SearchCard/SearchCard';
import SwitchBox from '../../components/SwitchBox/SwitchBox';
import NightMode from '../../components/NightMode/NightMode'; 
import axios from 'axios';
import URL_BACK from '../../../config';

const MainPage = () => {
    const location = useLocation();
    const email = location.state?.email || ''; // Obtener el email del estado de navegación

    const [showFruits, setShowFruits] = useState(() => {
        const storedValue = localStorage.getItem('showFruits');
        return storedValue ? JSON.parse(storedValue) : true;
    });
    const [showVegetables, setShowVegetables] = useState(() => {
        const storedValue = localStorage.getItem('showVegetables');
        return storedValue ? JSON.parse(storedValue) : true;
    });

    const [nightMode, setNightMode] = useState(() => {
        const storedValue = localStorage.getItem('nightMode');
        return storedValue ? JSON.parse(storedValue) : false;
    });

    const [searchResults, setSearchResults] = useState([]);
    
    const toggleShowFruits = () => {
        setShowFruits(!showFruits);
    };

    const toggleShowVegetables = () => {
        setShowVegetables(!showVegetables);
    };

    const toggleNightMode = () => {
        const newNightMode = !nightMode;
        setNightMode(newNightMode);
        localStorage.setItem('nightMode', JSON.stringify(newNightMode));
    };

    useEffect(() => {
        localStorage.setItem('showFruits', JSON.stringify(showFruits));
    }, [showFruits]);

    useEffect(() => {
        localStorage.setItem('showVegetables', JSON.stringify(showVegetables));
    }, [showVegetables]);

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

                const response = await axios.get(`${URL_BACK}/users/${userEmail}`, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                    }
                  });

                const users = usersResponse.data;
                const ingredients = ingredientsResponse.data;

                // Associer les ingrédients aux utilisateurs
                const results = users.map(user => {
                    return {
                        name: user.name,
                        direccion: user.address, // Assurez-vous que le champ adresse est correct
                        productos: ingredients.filter(ingredient => ingredient.userId === user.id).map(ingredient => ingredient.name)
                    };
                });

                setSearchResults(results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const shouldShowResult = (result) => {
        return (
            (showFruits && result.productos.some(product => ["manzana", "naranjas", "piña", "limones", "peras", "uvas", "sandía", "frutillas"].includes(product))) ||
            (showVegetables && result.productos.some(product => ["zanahoria", "brocoli", "rabano", "papas", "tomates", "cebollas", "espinacas", "pepinos"].includes(product)))
        );
    };

    const filteredResults = searchResults.filter(result => shouldShowResult(result));

    return (
        <div className={nightMode ? "dark-mode" : ""}>
            <NavBar2 />
            <h1>¡Bienvenido {email}!</h1> {/* Mostrar el mensaje de bienvenida */}
            <div className="d-flex justify-content-center align-items-start">
                <SwitchBox showFruits={showFruits} showVegetables={showVegetables} toggleShowFruits={toggleShowFruits} toggleShowVegetables={toggleShowVegetables} />
                <NightMode nightMode={nightMode} toggleNightMode={toggleNightMode} />
                <Mapa height="200px" width="300px" className="Mapa" />
                <div className="search-container">
                    <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
                        <ul className="list-group">
                            {filteredResults.map((result, index) => (
                                <li key={index} className="list-group-item">
                                    <SearchCard name={result.name} direccion={result.direccion} productos={result.productos} />
                                </li>
                            ))}
                        </ul>
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
