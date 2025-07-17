import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

const Notification = ({ message, type, onClose }) => {
    let bgColor = '';
    let textColor = '';
    let iconColor = '';

    switch (type) {
        case 'success':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            iconColor = 'text-green-500';
            break;
        case 'error':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            iconColor = 'text-red-500';
            break;
        case 'warning':
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            iconColor = 'text-yellow-500';
            break;
        default:
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            iconColor = 'text-blue-500';
            break;
    }

    if (!message) return null;

    return (
        <div className={`p-4 rounded-lg shadow-lg flex items-center justify-between ${bgColor} ${textColor} min-w-[300px]`}>
            <p className="font-semibold flex-grow">{message}</p>
            <button onClick={onClose} className={`ml-4 p-1 rounded-full hover:bg-opacity-75 ${iconColor}`}>
                <XCircleIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

export default Notification;