import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OtherFridge.css';
import NavBar2 from '../../components/NavBar2/NavBar2';
import axios from 'axios';
import URL_BACK from '../../../config';
import IngredientCard from '../../components/IngredientCard/IngredientCard';

function OtherFridge() {
    const navigate = useNavigate();
    const location = useLocation(); // Utilisation de useLocation pour accéder à la localisation actuelle
    const [email, setEmail] = useState('');
    const [userIngredients, setUserIngredients] = useState([]);

    useEffect(() => {
        const fetchUserEmail = async () => {
            const userEmail = location.state?.email; // Récupération de l'email depuis location.state
            if (userEmail) {
                setEmail(userEmail);
                fetchIngredients(userEmail);
            }
        };
        fetchUserEmail();
    }, [location]); // Ajout de location comme dépendance pour que useEffect se déclenche à chaque changement de localisation

    const fetchIngredients = async (userEmail) => {
        try {
            const response = await axios.get(`${URL_BACK}/ingredientes/user/${userEmail}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUserIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            alert('Error fetching ingredients:', error.message);
        }
    };

    const handleAddIngredient = () => {
        navigate('/addingredient');
    };

    return (
        <div className='container-fluid p-0 landing-page'>
            <NavBar2 />
            <div className="container mt-5">
                <div className="row justify-content-center align-items-center">
                    <div className="col text-center">
                        <h1 className="mt-5">My Fridge</h1>
                        <button onClick={handleAddIngredient} className="btn-add">Add</button>
                        <div className="mt-4">
                            <p>FRIDGE'S {email}</p>
                            <div className="d-flex justify-content-around flex-wrap">
                                {userIngredients.map((ingredient, index) => (
                                    <div key={index} className='ingredient-card'>
                                        <IngredientCard ingredient={ingredient} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OtherFridge;
