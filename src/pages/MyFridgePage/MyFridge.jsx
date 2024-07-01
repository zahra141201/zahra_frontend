import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyFridge.css';
import NavBar2 from '../../components/NavBar2/NavBar2';
import axios from 'axios';
import URL_BACK from '../../../config';
import IngredientCard from '../../components/IngredientCard/IngredientCard';
import EditIngredientForm from '../../components/EditIngredientForm/EditIngredientForm';

function MyFridgePage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [userIngredients, setUserIngredients] = useState([]);
    const [ingredientRequests, setIngredientRequests] = useState({});
    const [editingIngredientId, setEditingIngredientId] = useState(null);

    useEffect(() => {
        const fetchUserEmail = async () => {
            const userEmail = localStorage.getItem('email');
            if (userEmail) {
                setEmail(userEmail);
                fetchIngredients(userEmail);
            }
        };
        fetchUserEmail();
    }, []);

    const fetchIngredients = async (userEmail) => {
        try {
            const response = await axios.get(`${URL_BACK}/ingredientes/user/${userEmail}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUserIngredients(response.data);
            response.data.forEach(ingredient => fetchRequestsForIngredient(ingredient.id));
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            
        }
    };

    const fetchRequestsForIngredient = async (ingredientId) => {
        try {
            const response = await axios.get(`${URL_BACK}/requests/ingredient/${ingredientId}`);
            setIngredientRequests(prevState => ({
                ...prevState,
                [ingredientId]: response.data
            }));
        } catch (error) {
            console.error('Error fetching requests:', error);
      
        }
    };

    const handleAddIngredient = () => {
        navigate('/addingredient');
    };

    const handleEditIngredient = (ingredientId) => {
        setEditingIngredientId(ingredientId);
    };

    const handleCancelEdit = () => {
        setEditingIngredientId(null);
    };

    const handleUpdateIngredient = (updatedIngredient) => {
        const updatedIngredients = userIngredients.map(ingredient =>
            ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
        );
        setUserIngredients(updatedIngredients);
        setEditingIngredientId(null);
    };

    const handleDeleteIngredient = async (ingredientId) => {
        try {
            await axios.delete(`${URL_BACK}/ingredientes/${ingredientId}`);
            const updatedIngredients = userIngredients.filter(ingredient => ingredient.id !== ingredientId);
            setUserIngredients(updatedIngredients);
        } catch (error) {
            console.error('Error deleting ingredient:', error);
      
        }
    };

    const handleUpdateRequestStatus = async (ingredientId, requestId, status) => {
        const request = ingredientRequests[ingredientId].find(req => req.id === requestId);
        
        if (!request) {
            console.error('Request not found');
            return;
        }

        try {
            const updatedRequest = {
                ...request,
                state: status
            };
            
            await axios.patch(`${URL_BACK}/requests/ingredient/${ingredientId}`, updatedRequest);

            const updatedRequests = ingredientRequests[ingredientId].map(req =>
                req.id === requestId ? { ...req, state: status } : req
            );
            setIngredientRequests(prevState => ({
                ...prevState,
                [ingredientId]: updatedRequests
            }));
        } catch (error) {
            console.error('Error updating request status:', error);
     
        }
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
                                        {editingIngredientId === ingredient.id ? (
                                            <EditIngredientForm
                                                ingredientId={ingredient.id}
                                                onCancel={handleCancelEdit}
                                                onUpdate={handleUpdateIngredient}
                                            />
                                        ) : (
                                            <IngredientCard
                                                ingredient={ingredient}
                                                onDelete={handleDeleteIngredient}
                                                onUpdate={handleEditIngredient}
                                            />
                                        )}
                                        <div className="requests">
                                            {ingredientRequests[ingredient.id] && ingredientRequests[ingredient.id].filter(request => request.state !== 'refused').map(request => (
                                                <div key={request.id} className="request">
                                                    <p>{`Request: ${request.id}, Status: ${request.state}`}</p>
                                                    {request.state === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleUpdateRequestStatus(ingredient.id, request.id, 'accepted')}>Accept</button>
                                                            <button onClick={() => handleUpdateRequestStatus(ingredient.id, request.id, 'refused')}>Refuse</button>
                                                        </>
                                                    )}
                                                    {request.state === 'accepted' && (
                                                        <button onClick={() => handleUpdateRequestStatus(ingredient.id, request.id, 'refused')}>Refuse</button>
                                                    )}
                                                </div>
                                            ))}
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

export default MyFridgePage;
