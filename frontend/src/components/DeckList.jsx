import { useState } from 'react';
import './DeckList.css';

function DeckList({ decks, pendingUploads = [], selectedDeckId, onSelectDeck, onDeleteDeck, onExportDeck, onRemovePending, loading }) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDelete = (e, deckId) => {
        e.stopPropagation();
        if (deleteConfirm === deckId) {
            onDeleteDeck(deckId);
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(deckId);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const handleExport = (e, deckId) => {
        e.stopPropagation();
        onExportDeck(deckId);
    };

    if (loading) {
        return (
            <div className="deck-list">
                <div className="deck-list-header">
                    <h3>📁 Decks</h3>
                </div>
                <div className="deck-loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="deck-list">
            <div className="deck-list-header">
                <h3>📁 Decks</h3>
            </div>

            <div className="deck-items">
                {/* Pending uploads - show at top with loading */}
                {pendingUploads.map(upload => (
                    <div key={upload.id} className={`deck-item pending ${upload.status === 'error' ? 'error' : ''}`}>
                        <div className="deck-info">
                            {upload.status === 'uploading' ? (
                                <span className="deck-spinner"></span>
                            ) : (
                                <span className="deck-icon">⚠️</span>
                            )}
                            <span className="deck-name">{upload.name}</span>
                            {upload.status === 'uploading' && (
                                <span className="deck-status">Generating...</span>
                            )}
                        </div>
                        {upload.status === 'error' && (
                            <button
                                className="deck-action-btn delete"
                                onClick={() => onRemovePending(upload.id)}
                                title="Dismiss"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}

                {/* Existing decks */}
                {decks.map(deck => (
                    <div
                        key={deck.id}
                        className={`deck-item ${selectedDeckId === deck.id ? 'active' : ''}`}
                        onClick={() => onSelectDeck(deck.id)}
                    >
                        <div className="deck-info">
                            <span className="deck-icon">📄</span>
                            <span className="deck-name">{deck.name}</span>
                            <span className="deck-count">{deck.card_count}</span>
                        </div>
                        <div className="deck-actions">
                            <button
                                className="deck-action-btn export"
                                onClick={(e) => handleExport(e, deck.id)}
                                title="Export deck"
                            >
                                ↓
                            </button>
                            <button
                                className={`deck-action-btn delete ${deleteConfirm === deck.id ? 'confirm' : ''}`}
                                onClick={(e) => handleDelete(e, deck.id)}
                                title={deleteConfirm === deck.id ? "Click again to confirm" : "Delete deck"}
                            >
                                {deleteConfirm === deck.id ? '✓' : '×'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {decks.length === 0 && pendingUploads.length === 0 && (
                <div className="deck-empty">
                    <p>No decks yet</p>
                    <span>Upload a PDF to create your first deck</span>
                </div>
            )}
        </div>
    );
}

export default DeckList;
