import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddIngredientForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import URL_BACK from '../../../config';

const AddIngredientForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        expiration_date: '',
        owner: '',
        weight: '',
        bought_date: '',
        price: '',
        description: '',
    });

    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${URL_BACK}/ingredientes`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                navigate('/MyFridge');
            }
        } catch (error) {
            setError(`Error ${error.response ? error.response.status : ''} en POST`);
            console.error('Error:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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
                <span className="input-group-text" id="basic-addon3">Owner:</span>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Owner" 
                    aria-label="Owner" 
                    aria-describedby="basic-addon3" 
                    name="owner"
                    value={formData.owner}
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
            </div>
        </form>
    );
};

export default AddIngredientForm;
