import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header({ onUpload, onExport, cardsCount, deckName }) {
    const { logout } = useAuth();

    return (
        <header className="header glass">
            <div className="header-content">
                <div className="header-brand">
                    <span className="header-logo">📚</span>
                    <div className="header-title-group">
                        <h1 className="header-title">Anki Generator</h1>
                        {deckName && <span className="header-deck-name">/ {deckName}</span>}
                    </div>
                </div>

                <div className="header-stats">
                    <div className="stat-badge">
                        <span className="stat-value">{cardsCount}</span>
                        <span className="stat-label">Cards</span>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn btn-primary" onClick={onUpload}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload PDF
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={onExport}
                        disabled={cardsCount === 0}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export{deckName ? ' Deck' : ''}
                    </button>

                    <button className="btn btn-secondary" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;

