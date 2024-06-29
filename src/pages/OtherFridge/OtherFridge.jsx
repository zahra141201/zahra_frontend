import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './OtherFridge.css';
import NavBar2 from '../../components/NavBar2/NavBar2';
import axios from 'axios';
import URL_BACK from '../../../config';
import OtherIngredient from '../../components/OtherIngredient/OtherIngredient';

function OtherFridge() {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [userIngredients, setUserIngredients] = useState([]);

    useEffect(() => {
        const fetchUserEmail = async () => {
            const userEmail = location.state?.email;
            if (userEmail) {
                setEmail(userEmail);
                fetchIngredients(userEmail);
            }
        };
        fetchUserEmail();
    }, [location]);

    const fetchIngredients = async (userEmail) => {
        try {
            const response = await axios.get(`${URL_BACK}/ingredientes/user/${userEmail}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUserIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            alert('Error fetching ingredients:', error.message);
        }
    };

    return (
        <div className='container-fluid p-0 landing-page'>
            <NavBar2 />
            <div className="container mt-5">
                <div className="row justify-content-center align-items-center">
                    <div className="col text-center">
                        <h1 className="mt-5">My Fridge</h1>
                        <div className="mt-4">
                            <p>FRIDGE'S {email}</p>
                            <div className="d-flex justify-content-around flex-wrap">
                                {userIngredients.map((ingredient, index) => (
                                    <div key={index} className='ingredient-card'>
                                        <OtherIngredient ingredient={ingredient} />
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

export default OtherFridge;
