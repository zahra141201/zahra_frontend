import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar2 from '../../components/NavBar2/NavBar2';
import ValorationCard from '../../components/ValorationCard/ValorationCard';
import URL_BACK from '../../../config';
const Valorationpage = () => {
    const [valorationsData, setValorationsData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchValorations = async () => {
            try {
                const response = await axios.get(`${URL_BACK}/valorations`); // Ajusta la URL según tu backend
                if (Array.isArray(response.data)) {
                    setValorationsData(response.data);
                } else {
                    setError("La respuesta no es un array");
                }
            } catch (error) {
                setError(error);
                console.error("Error fetching valorations data:", error);
            }
        };

        fetchValorations();
    }, []);

    return (
        <div>
            <NavBar2 />
            <div>
            {error && <div className="alert alert-danger">Error al cargar las valoraciones</div>}
            <ul className="list-group">
                {Array.isArray(valorationsData) && valorationsData.map((result, index) => (
                    <li key={index} className="list-group-item">
                        <ValorationCard 
                            comment={result.comment} 
                            email_user={result.email_user} 
                            puntuation={result.puntuation} 
                        />
                    </li>
                ))}
            </ul>
            </div>
        </div>
    );
};

export default Valorationpage;
