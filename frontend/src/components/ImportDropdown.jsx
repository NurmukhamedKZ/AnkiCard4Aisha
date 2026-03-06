import { useState, useRef, useEffect } from 'react';
import './ImportDropdown.css';

// Icons as SVG components
const PDFIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="12" height="16" rx="2" fill="#E53935" />
        <path d="M16 2v4h4" stroke="#B71C1C" strokeWidth="1.5" />
        <polygon points="16,2 20,6 16,6" fill="#FFCDD2" />
        <text x="8" y="14" fontSize="5" fill="white" fontWeight="bold">PDF</text>
    </svg>
);

const AnkiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#1976D2" />
        <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CSVIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#43A047" />
        <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const QuizletIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#4255FF" />
        <text x="7" y="16" fontSize="10" fill="white" fontWeight="bold">Q</text>
    </svg>
);

const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

function ImportDropdown({ isOpen, onClose, onSelectOption }) {
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
            id: 'pdf',
            icon: <PDFIcon />,
            title: 'PDF',
            subtitle: 'AI will generate cards from a PDF',
        },
        {
            id: 'anki',
            icon: <AnkiIcon />,
            title: 'Anki',
            subtitle: '.apkg, .colpkg, .ofc formats',
        },
        {
            id: 'csv',
            icon: <CSVIcon />,
            title: 'CSV',
            subtitle: 'Import cards from a CSV',
        },
        {
            id: 'quizlet',
            icon: <QuizletIcon />,
            title: 'Quizlet',
            subtitle: 'Import sets / cards from Quizlet',
        },
    ];

    return (
        <div className="import-dropdown glass" ref={dropdownRef}>
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

export default ImportDropdown;
