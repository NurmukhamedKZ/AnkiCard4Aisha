import { useState } from 'react';
import './DeckList.css';

function DeckList({ decks, selectedDeckId, onSelectDeck, onDeleteDeck, onExportDeck, loading }) {
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
                {/* All Cards option */}
                <div
                    className={`deck-item ${selectedDeckId === null ? 'active' : ''}`}
                    onClick={() => onSelectDeck(null)}
                >
                    <div className="deck-info">
                        <span className="deck-icon">📚</span>
                        <span className="deck-name">All Cards</span>
                    </div>
                </div>

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

            {decks.length === 0 && (
                <div className="deck-empty">
                    <p>No decks yet</p>
                    <span>Upload a PDF to create your first deck</span>
                </div>
            )}
        </div>
    );
}

export default DeckList;
