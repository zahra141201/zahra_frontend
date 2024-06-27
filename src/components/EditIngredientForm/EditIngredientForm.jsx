import React, { useState, useEffect } from 'react';
import axios from 'axios';
import URL_BACK from '../../../config';

const EditIngredientForm = ({ ingredientId, onCancel, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        expiration_date: '',
        weight: '',
        bought_date: '',
        price: '',
        description: '',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIngredient = async () => {
            try {
                const response = await axios.get(`${URL_BACK}/ingredientes/${ingredientId}`);
                const { data } = response;
                setFormData(data); // Setear los datos del ingrediente en el formulario
            } catch (error) {
                setError(`Error ${error.response ? error.response.status : ''} en GET`);
                console.error('Error:', error);
            }
        };

        fetchIngredient();
    }, [ingredientId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.patch(`${URL_BACK}/ingredientes/${ingredientId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                onUpdate(formData); // Actualizar el estado del ingrediente en el componente padre
            }
        } catch (error) {
            setError(`Error ${error.response ? error.response.status : ''} en PATCH`);
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='container-signUPform'>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Name:</span>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Name" 
                    aria-label="Name" 
                    aria-describedby="basic-addon1" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon2">Expiration Date:</span>
                <input 
                    type="datetime-local" 
                    className="form-control" 
                    aria-label="Expiration Date" 
                    aria-describedby="basic-addon2" 
                    name="expiration_date"
                    value={formData.expiration_date}
                    onChange={handleInputChange}
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon4">Weight:</span>
                <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Weight" 
                    aria-label="Weight" 
                    aria-describedby="basic-addon4" 
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon5">Bought Date:</span>
                <input 
                    type="datetime-local" 
                    className="form-control" 
                    aria-label="Bought Date" 
                    aria-describedby="basic-addon5" 
                    name="bought_date"
                    value={formData.bought_date}
                    onChange={handleInputChange}
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon6">Price:</span>
                <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Price" 
                    aria-label="Price" 
                    aria-describedby="basic-addon6" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon7">Description:</span>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Description" 
                    aria-label="Description" 
                    aria-describedby="basic-addon7" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>
            <div className="text-center">
                <button className="btn btn-custom" type="submit">Submit</button>
                <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default EditIngredientForm;
