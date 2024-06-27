import React from 'react';
import './SearchCard.css';
import 'bootstrap/dist/css/bootstrap.min.css';



const SearchCard = ({ name, direccion, productos }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <h4 className="card-text">{direccion}</h4>
                <h3 className="card-text"><strong>Products: </strong>{productos.join(", ")}</h3>
            </div>
        </div>
    );
};

export default SearchCard;
