import React from 'react';
import AddIngredientForm from '../../components/AddIngredientForm/AddIngredientForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar2 from '../../components/NavBar2/NavBar2';

const SignUp = () => {
    return (
        <div>
            <NavBar2/>
            <AddIngredientForm />
        </div>
    );
};

export default SignUp;