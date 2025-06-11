// components/ui/Modal.js
import React from 'react';

const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 5,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    border: 'none',
                    background: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                }}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
