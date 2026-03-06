import { useState, useRef, useEffect } from 'react';
import './FolderMenu.css'; // Reuse styles

const DeckMenu = ({ onStudy, onExport, onMove, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleAction = (action) => {
        setIsOpen(false);
        if (action) action();
    };

    return (
        <div className="folder-menu-container" ref={menuRef}>
            <div
                className="action-icon menu-trigger"
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            >
                ⋯
            </div>

            {isOpen && (
                <div className="folder-context-menu">
                    <div className="menu-item" onClick={(e) => { e.stopPropagation(); handleAction(onStudy); }}>
                        <span className="menu-icon">🎯</span>
                        <span>Study</span>
                    </div>
                    <div className="menu-item" onClick={(e) => { e.stopPropagation(); handleAction(onExport); }}>
                        <span className="menu-icon">↓</span>
                        <span>Export</span>
                    </div>
                    <div className="menu-item" onClick={(e) => { e.stopPropagation(); handleAction(onMove); }}>
                        <span className="menu-icon">⇅</span>
                        <span>Move to Folder</span>
                    </div>
                    <div className="menu-item delete" onClick={(e) => { e.stopPropagation(); handleAction(onDelete); }}>
                        <span className="menu-icon">🗑</span>
                        <span>Delete</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeckMenu;
