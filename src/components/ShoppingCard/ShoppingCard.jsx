import React, { useState } from 'react';
import axios from 'axios';
import URL_BACK from '../../../config';
import './IngredientCard.css'; // Importe el archivo de estilos CSS para IngredientCard

const ShoppingCard = ({ ingredient }) => {
    const [error, setError] = useState('');
    const [requestInfo, setRequestInfo] = useState(null);

    useEffect(() => {
        const fetchRequestInfo = async () => {
            try {
                const response = await axios.get(`${URL_BACK}/requests/ingredient/${ingredient.id}`);
                if (response.data.length > 0) {
                    setRequestInfo(response.data[0]); // Utilise la première demande (si elle existe) pour simplifier l'affichage
                }
            } catch (error) {
                console.error('Error fetching request info:', error);
                setError('Error fetching request info');
            }
        };
        fetchRequestInfo();
    }, [ingredient.id]);

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
                {requestInfo && (
                    <div className='request-info'>
                        <h4>Request Info:</h4>
                        <p><strong>Made by:</strong> {requestInfo.made_by}</p>
                        <p><strong>Status:</strong> {requestInfo.state}</p>
                        <p><strong>Pick-up Date:</strong> {requestInfo.pick_up_date}</p>
                        <p><strong>Comment:</strong> {requestInfo.comment}</p>
                    </div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
};

export default ShoppingCard;
