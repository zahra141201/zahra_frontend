import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import ClickCircle from '../../components/ClickCircle/ClickCircle';
import './InstructionsPage.css';

const InstructionPage = () => {
    // Estado para controlar el estado de clickeado de cada título
    const [isChecked, setIsChecked] = useState(() => {
        const storedCheckedState = JSON.parse(localStorage.getItem('isCheckedState'));
        if (storedCheckedState) {
            return storedCheckedState;
        } else {
            return {
                overview: false,
                featureExplanations: false,
                homepageNavigation: false,
                profileManagement: false,
                fridgePage: false,
                interactionWithOtherUsers: false,
                addingItems: false,
                guidesForInteraction: false
            };
        }
    });

    // Función para manejar el clic en cada título
    const handleTitleClick = (title) => {
        setIsChecked({
            ...isChecked,
            [title]: !isChecked[title]
        });
    };

    // Efecto para guardar el estado en el almacenamiento local al cambiar
    useEffect(() => {
        localStorage.setItem('isCheckedState', JSON.stringify(isChecked));
    }, [isChecked]);

    return (
        <div>
            <NavBar />
            <div className="instruction-container">
                <h1>Application Guide</h1>
                <div className="titles-section">
                    <div className="title-container">
                        <h2>Overview</h2>
                        <ClickCircle isChecked={isChecked.overview} onClick={() => handleTitleClick('overview')} />
                    </div>
                    {isChecked.overview && (
                        <p>This page is designed to guide users on how to navigate and use the application. It should include explanations about the functionality and objectives of each feature. Each section of the page must clarify the purpose of the implemented components and provide guides on how to interact with them.</p>
                    )}

                    <div className="title-container">
                        <h2>Feature Explanations</h2>
                        <ClickCircle isChecked={isChecked.featureExplanations} onClick={() => handleTitleClick('featureExplanations')} />
                    </div>
                    {isChecked.featureExplanations && (
                        <p>This page serves as a comprehensive guide to help users understand and effectively utilize the application's features. Each functionality within the application is tailored to enhance user experience and achieve specific objectives.</p>
                    )}

                    <div className="title-container">
                        <h2>Homepage Navigation</h2>
                        <ClickCircle isChecked={isChecked.homepageNavigation} onClick={() => handleTitleClick('homepageNavigation')} />
                    </div>
                    {isChecked.homepageNavigation && (
                    <div>
                        <p><b>Purpose:</b> The homepage provides an overview of the application's primary functions and quick access to essential features.</p>
                        <p><b>How to Use:</b> Navigate through the tabs and sections to explore various functionalities such as viewing profiles, searching for items, and accessing your fridge.</p>
                    </div>
                )}
                     <div className="title-container">
                        <h2>Profile Management</h2>
                        <ClickCircle isChecked={isChecked.profileManagement} onClick={() => handleTitleClick('profileManagement')} />
                    </div>
                    {isChecked.profileManagement && (
                    <div>
                        <p><b>Purpose:</b> Your profile contains personal information and activity history, allowing you to manage your details and interactions within the app.</p>
                        <p><b>How to Use:</b> Update your personal information, view your score, and track your activity by accessing the profile page.</p>
                    </div>
                )}

                <div className="title-container">
                        <h2>Fridge Page</h2>
                        <ClickCircle isChecked={isChecked.fridgePage} onClick={() => handleTitleClick('fridgePage')} />
                    </div>
                    {isChecked.fridgePage && (
                    <div>
                        <p><b>Purpose:</b> This feature allows you to manage the items you have available for exchange or sale.</p>
                        <p><b>How to Use:</b> Add new items, update existing ones, and view requests from other users. Each item entry includes details like weight, condition, and purchase date.</p>
                    </div>
                )}
                <div className="title-container">
                        <h2>Interaction with Other Users</h2>
                        <ClickCircle isChecked={isChecked.interactionWithOtherUsers} onClick={() => handleTitleClick('interactionWithOtherUsers')} />
                    </div>
                    {isChecked.interactionWithOtherUsers && (
                    <div>
                        <p><b>Purpose:</b> Facilitates the exchange of items and communication with other users.</p>
                        <p><b>How to Use:</b> Browse through other users’ profiles, accept or refuse requests, and manage your transactions through the app's interface.</p>
                    </div>
                )}
                <div className="title-container">
                        <h2>Adding Items</h2>
                        <ClickCircle isChecked={isChecked.addingItems} onClick={() => handleTitleClick('addingItems')} />
                    </div>
                    {isChecked.addingItems && (
                    <div>
                        <p><b>Purpose:</b> Enables users to add new items to their fridge for sale or exchange.</p>
                        <p><b>How to Use:</b> Fill in the details of the item such as name, price, condition, and expiration date, then upload a photo and add the item to your list.</p>
                    </div>
                )}
                <div className="title-container">
                        <h2>Guides for Interaction</h2>
                        <ClickCircle isChecked={isChecked.guidesForInteraction} onClick={() => handleTitleClick('guidesForInteraction')} />
                    </div>
                    {isChecked.guidesForInteraction && (
                    <div>
                        <p><b>Navigation Tips:</b> Utilize the menu to quickly switch between different sections. Use the search function to find specific items or users.</p>
                        <p><b>Profile Updates:</b> Regularly update your profile to ensure accurate information and maintain your credibility within the community.</p>
                        <p><b>Managing Requests:</b> Respond promptly to requests to ensure smooth transactions and positive interactions.</p>
                        <p><b>Adding Accurate Information:</b> Provide detailed and honest descriptions of your items to build trust and ensure successful exchanges.</p>
                    </div>
                )}



                <p>This page aims to empower users with the knowledge needed to make the most of the application, ensuring a seamless and efficient experience.</p>
                </div>
            </div>
        </div>
    );
};
export default InstructionPage;




