import { useState, useRef, useEffect } from 'react';
import './CreateDropdown.css';

// Icons as SVG components
const DeckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
    </svg>
);

const AIIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

const FolderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

function CreateDropdown({ isOpen, onClose, onSelectOption }) {
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const options = [
        {
            id: 'deck',
            icon: <DeckIcon />,
            title: 'Create deck',
            subtitle: 'Organize flashcards into decks',
        },
        {
            id: 'generate',
            icon: <AIIcon />,
            title: 'Generate with AI',
            subtitle: 'Create cards with AI',
        },
        {
            id: 'folder',
            icon: <FolderIcon />,
            title: 'Create folder',
            subtitle: 'Organize decks into folders',
        },
    ];

    return (
        <div className="create-dropdown glass" ref={dropdownRef}>
            {options.map((option) => (
                <button
                    key={option.id}
                    className="dropdown-option"
                    onClick={() => {
                        onSelectOption(option.id);
                        onClose();
                    }}
                >
                    <div className="option-icon">{option.icon}</div>
                    <div className="option-content">
                        <span className="option-title">{option.title}</span>
                        <span className="option-subtitle">{option.subtitle}</span>
                    </div>
                    <div className="option-arrow">
                        <ChevronRight />
                    </div>
                </button>
            ))}
        </div>
    );
}

export default CreateDropdown;
