import React from 'react';

function FailIcon({ className = "w-6 h-6 text-red-500" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.121-11.707a1 1 0 00-1.414-1.414L10 8.586 7.293 5.879a1 1 0 10-1.414 1.414L8.586 10l-2.707 2.707a1 1 0 101.414 1.414L10 11.414l2.707 2.707a1 1 0 001.414-1.414L11.414 10l2.707-2.707z" clipRule="evenodd" />
        </svg>
    );
}

export default FailIcon;
