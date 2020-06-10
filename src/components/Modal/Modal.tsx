import React from 'react';
import './Modal.css';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Modal({
    children,
    onClick,
}: {
    children: React.ReactElement[];
    onClick?: () => void;
}) {
    return (
        <div className={'modal'}>
            <div className={'modal--content'}>
                <div className={'modal--x'} onClick={onClick}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                {children}
            </div>
        </div>
    );
}
