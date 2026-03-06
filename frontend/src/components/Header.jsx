import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ImportDropdown from './ImportDropdown';
import CreateDropdown from './CreateDropdown';
import './Header.css';

function Header({
    onImportOption,
    onCreateOption,
    onExport,
    cardsCount,
    deckName,
    decks,
    selectedDeckId,
    onSelectDeck,
    onStudy,
}) {
    const { logout } = useAuth();
    const [showImportDropdown, setShowImportDropdown] = useState(false);
    const [showCreateDropdown, setShowCreateDropdown] = useState(false);

    const handleImportClick = (e) => {
        e.stopPropagation();
        setShowImportDropdown(!showImportDropdown);
        setShowCreateDropdown(false);
    };

    const handleCreateClick = (e) => {
        e.stopPropagation();
        setShowCreateDropdown(!showCreateDropdown);
        setShowImportDropdown(false);
    };

    return (
        <header className="header glass">
            <div className="header-content">
                <div className="header-brand">
                    <span className="header-logo">📚</span>
                    <div className="header-title-group">
                        <h1 className="header-title">Satori.io</h1>
                        {deckName && <span className="header-deck-name desktop-only">/ {deckName}</span>}
                    </div>
                </div>

                {/* Mobile deck selector */}
                {decks && decks.length > 0 && (
                    <div className="mobile-deck-selector">
                        <select
                            value={selectedDeckId || ''}
                            onChange={(e) => onSelectDeck(e.target.value ? parseInt(e.target.value) : null)}
                            className="deck-dropdown"
                        >
                            <option value="">Home</option>
                            {decks.map(deck => (
                                <option key={deck.id} value={deck.id}>
                                    {deck.name} ({deck.card_count})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="header-stats">
                    <div className="stat-badge">
                        <span className="stat-value">{cardsCount}</span>
                        <span className="stat-label">Cards</span>
                    </div>
                </div>

                <div className="header-actions">
                    {/* Import Button with Dropdown */}
                    <div className="dropdown-container">
                        <button
                            className="btn btn-secondary btn-import-header"
                            onClick={handleImportClick}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span className="btn-text">Import</span>
                        </button>
                        <ImportDropdown
                            isOpen={showImportDropdown}
                            onClose={() => setShowImportDropdown(false)}
                            onSelectOption={onImportOption}
                        />
                    </div>

                    {/* Study Button */}
                    {onStudy && (
                        <button
                            className="btn btn-primary btn-study-header"
                            onClick={onStudy}
                        >
                            <span className="btn-icon">🎯</span>
                            <span className="btn-text">Study</span>
                        </button>
                    )}

                    {/* Create Button with Dropdown */}
                    <div className="dropdown-container">
                        <button
                            className="btn btn-primary btn-create-header"
                            onClick={handleCreateClick}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <span className="btn-text">Create</span>
                        </button>
                        <CreateDropdown
                            isOpen={showCreateDropdown}
                            onClose={() => setShowCreateDropdown(false)}
                            onSelectOption={onCreateOption}
                        />
                    </div>

                    <button className="btn btn-secondary btn-logout" onClick={logout}>
                        <span className="btn-text-logout">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
