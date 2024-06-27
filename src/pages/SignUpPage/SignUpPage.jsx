import React from 'react';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../../components/NavBar/NavBar';

const SignUp = () => {
    return (
        <div>
            <NavBar />
            <SignUpForm />
        </div>
    );
};

export default SignUp;