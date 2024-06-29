import React from 'react';
import './OtherIngredient.css'; // Importe le fichier de styles CSS pour IngredientCard

const OtherIngredient = ({ ingredient }) => {
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
                {/* Supprime les boutons Edit et Delete */}
            </div>
        </div>
    );
};

export default OtherIngredient;
