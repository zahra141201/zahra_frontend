import React, { useState, useEffect } from 'react';
import './OtherIngredient.css'; // Importe le fichier de styles CSS pour IngredientCard
import axios from 'axios';
import URL_BACK from '../../../config';

const OtherIngredient = ({ ingredient }) => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [pickUpDate, setPickUpDate] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${URL_BACK}/requests/ingredient/${ingredient.id}`);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
                setError('Error fetching requests');
            }
        };
        fetchRequests();
    }, [ingredient.id]);

    const handleMakeRequest = () => {
        setShowRequestForm(true);
    };

    const handleSubmitRequest = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${URL_BACK}/requests/`, {
                pick_up_date: pickUpDate,
                comment: comment,
                state: 'pending', // État initial de la demande
                made_by: localStorage.getItem('email'), // Remplacer par l'utilisateur connecté
                id_ingrediente: ingredient.id, // ID de l'ingrédient
            });
            console.log('Request created:', response.data);
            // Réinitialisation du formulaire et de l'état
            setPickUpDate('');
            setComment('');
            setShowRequestForm(false);
            setError('');
            // Rafraîchir les demandes après création
            fetchRequests();
        } catch (error) {
            console.error('Error creating request:', error);
            setError('An error occurred while creating the request');
        }
    };

    return (
        <div className='ingredient-card'>
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
                {showRequestForm ? (
                    <form onSubmit={handleSubmitRequest}>
                        <label htmlFor='pickUpDate'>Pick-up Date:</label>
                        <input
                            type='date'
                            id='pickUpDate'
                            value={pickUpDate}
                            onChange={(e) => setPickUpDate(e.target.value)}
                            required
                        />
                        <label htmlFor='comment'>Comment:</label>
                        <textarea
                            id='comment'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            required
                        />
                        <button type='submit'>Submit</button>
                        {error && <div className='error-message'>{error}</div>}
                    </form>
                ) : (
                    <div>
                        <button onClick={handleMakeRequest}>Make a Request</button>
                        {requests.length > 0 && (
                            <div className='request-info'>
                                <h4>Requests:</h4>
                                {requests.map((request, index) => (
                                    <div key={index}>
                                        <p><strong>Made by:</strong> {request.made_by}</p>
                                        <p><strong>Status:</strong> {request.state}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OtherIngredient;
