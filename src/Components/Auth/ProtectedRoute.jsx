import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="auth-message">
                <h2>Please Sign In</h2>
                <p>You need to be logged in to view this content.</p>
                <Navigate to="/login" replace />
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;