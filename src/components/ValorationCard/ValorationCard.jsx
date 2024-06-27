import React from 'react';
import './ValorationCard.css';
import 'bootstrap/dist/css/bootstrap.min.css';



const ValorationCard = ({ comment, puntuation, email_user}) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{email_user}</h5>
                <h4 className="card-text">{comment}</h4>
                <h3 className="card-text">{puntuation}</h3>
            </div>
        </div>
    );
};

export default ValorationCard;
