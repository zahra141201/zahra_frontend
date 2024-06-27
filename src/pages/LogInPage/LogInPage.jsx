import React from 'react';
import LogInForm from '../../components/LogInForm/LogInForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../../components/NavBar/NavBar';

const LogIn = () => {
    return (
        <div>
            <NavBar />
            <LogInForm />
        </div>
    );
};

export default LogIn;