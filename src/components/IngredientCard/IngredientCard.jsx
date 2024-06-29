import React, { useState } from 'react';
import './IngredientCard.css'; // Importe le fichier de styles CSS pour IngredientCard
import axios from 'axios';

const IngredientCard = ({ ingredient }) => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [pickUpDate, setPickUpDate] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleMakeRequest = () => {
        setShowRequestForm(true);
    };

    const handleSubmitRequest = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/route_pour_create_request', {
                pick_up_date: pickUpDate,
                comment: comment,
                state: 'pending', // État initial de la demande
                made_by: 'user_id', // Remplacer par l'utilisateur connecté
                id_ingrediente: ingredient.id, // ID de l'ingrédient
            });
            console.log('Request created:', response.data);
            // Réinitialisation du formulaire et de l'état
            setPickUpDate('');
            setComment('');
            setShowRequestForm(false);
            setError('');
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
                    <button onClick={handleMakeRequest}>Make a Request</button>
                )}
            </div>
        </div>
    );
};

export default IngredientCard;
