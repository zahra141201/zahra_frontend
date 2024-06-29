import React, { useState } from 'react';
import axios from 'axios';
import URL_BACK from '../../../config';
import './IngredientCard.css'; // Importa el archivo de estilos CSS para IngredientCard
import EditIngredientForm from '../EditIngredientForm/EditIngredientForm.jsx';

const IngredientCard = ({ ingredient, onDelete, onUpdate }) => {
    const [editMode, setEditMode] = useState(false); // Estado para manejar el modo de edición
    const [error, setError] = useState('');

    const handleEdit = () => {
        setEditMode(true); // Activar el modo de edición
    };

    const handleCancelEdit = () => {
        setEditMode(false); // Desactivar el modo de edición
    };

    const handleDelete = async () => {
    try {
        const response = await axios.delete(`${URL_BACK}/ingredientes/${ingredient.id}`);
        if (response.status === 204) {
            onDelete(ingredient.id); // Eliminar el ingrediente del componente padre
        } else {
            setError(`Failed to delete ingredient: ${response.statusText}`);
        }
    } catch (error) {
        setError(`Error deleting ingredient: ${error.message}`);
    }
};

    const handleUpdate = (updatedIngredient) => {
        onUpdate(updatedIngredient); // Actualizar el ingrediente en el componente padre
        setEditMode(false); // Desactivar el modo de edición después de actualizar
    };

    return (
        <div className='ingredient-card'>
            <img src={ingredient.imageUrl} alt={ingredient.name} className='ingredient-image' />
            <div className='ingredient-info'>
                {editMode ? (
                    <EditIngredientForm
                        ingredientId={ingredient.id}
                        onCancel={handleCancelEdit}
                        onUpdate={handleUpdate}
                    />
                ) : (
                    <div>
                        <h3 className='ingredient-name'>{ingredient.name}</h3>
                        <p className='ingredient-weight'>{ingredient.weight}</p>
                        <p className='ingredient-expiration'>{ingredient.expiration_date}</p>
                        <p className='ingredient-bought-date'>{ingredient.bought_date}</p>
                        <p className='ingredient-price'>${ingredient.price}</p>
                        <p className='ingredient-description'>{ingredient.description}</p>
                        <div className="ingredient-buttons">
                            <button onClick={handleEdit} className="btn btn-custom">Edit</button>
                            <button onClick={() => handleDelete(ingredient.id)} className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
};

export default IngredientCard;


