import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Profile.css';

export default function Profile() {
    return (
        <div className='profile'>
            <h1 style={{fontFamily:'Montserrat', color:'#6c63ff'}}>Your Profile</h1>
            <h3 className="profile-username">Hello {localStorage.getItem('username')}!</h3>
            
            <div className="profile-message">
                <p>Keep up the great work! Every new word or phrase you learn brings you one step closer to fluency.</p>
                <p>Check your achievements to see how far you've come!</p>
            </div>
            
            <Link to="/progress" className="profile-button">View Achievements</Link>
        </div>
    );
}