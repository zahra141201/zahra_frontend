import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShoppingCart.css';
import NavBar2 from '../../components/NavBar2/NavBar2';
import axios from 'axios';
import URL_BACK from '../../../config';
import ShoppingCard from '../../components/ShoppingCard/ShoppingCard'; // Assure-toi que le chemin et le nom du fichier sont corrects

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

            alert('User Ingredients: ' + JSON.stringify(ingredients)); // Alert pour vérifier les données d'ingrédients récupérées
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
                                    <div key={index} className='ingredient-card'>
                                        <ShoppingCard
                                            ingredient={ingredient}
                                        />
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
