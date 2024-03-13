import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, onOk, onCancel, children }) => {

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Error</h2>
                <button className={styles.modalClose} onClick={onClose}>
                    X
                </button>
                </div>
                <div className={styles.modalBody}>
                {children}
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.modalButton} onClick={onOk}>
                        OK
                    </button>
                    <button className={styles.modalButton} onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
