import React from 'react';
import AddIngredientForm from '../../components/AddIngredientForm/AddIngredientForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../../components/NavBar/NavBar';

const SignUp = () => {
    return (
        <div>
            <NavBar />
            <AddIngredientForm />
        </div>
    );
};

export default SignUp;