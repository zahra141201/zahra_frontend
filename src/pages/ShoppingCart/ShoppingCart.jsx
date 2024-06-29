import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShoppingCart.css';
import NavBar2 from '../../components/NavBar2/NavBar2';
import axios from 'axios';
import URL_BACK from '../../../config';


function ShoppingCart() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [userIngredients, setUserIngredients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserEmail = async () => {
            const userEmail = localStorage.getItem('email');
            if (userEmail) {
                setEmail(userEmail);
                fetchRequests(userEmail);
            }
        };
        fetchUserEmail();
    }, []);

    const fetchRequests = async (userEmail) => {
        try {
            const response = await axios.get(`${URL_BACK}/requests/user/${userEmail}`);
            const requests = response.data;

            const ingredientPromises = requests.map(async (request) => {
                const ingredientResponse = await axios.get(`${URL_BACK}/ingredientes/${request.id_ingrediente}`);
                return ingredientResponse.data;
            });

            const ingredients = await Promise.all(ingredientPromises);
            setUserIngredients(ingredients);
            setLoading(false);

            alert('User Ingredients: ' + JSON.stringify(ingredients)); // Vérifie les données d'ingrédients récupérées
        } catch (error) {
            console.error('Error fetching requests and ingredients:', error);
            alert('Error fetching requests and ingredients:', error.message);
        }
    };

    const handleAddIngredient = () => {
        navigate('/addingredient');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
                                    <div key={index} className='shopping-card'>
                                        <img src={ingredient.imageUrl} alt={ingredient.name} className='ingredient-image' />
                                        <div className='ingredient-info'>
                                            <div>
                                                <h3 className='ingredient-name'>{ingredient.name}</h3>
                                                <p className='ingredient-weight'>{ingredient.weight}</p>
                                                <p className='ingredient-expiration'>{ingredient.expiration_date}</p>
                                                <p className='ingredient-bought-date'>{ingredient.bought_date}</p>
                                                <p className='ingredient-price'>${ingredient.price}</p>
                                                <p className='ingredient-description'>{ingredient.description}</p>
                                            </div>
                                            <div className='request-info'>
                                                <h4>Request Info:</h4>
                                                {/* Ajoute ici la logique pour récupérer et afficher les informations de demande */}
                                            </div>
                                        </div>
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

export default ShoppingCart;
