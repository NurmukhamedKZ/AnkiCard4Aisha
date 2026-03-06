import { useState } from 'react';
import './Modal.css';

function CreateDeckModal({ onClose, onCreate }) {
    const [deckName, setDeckName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!deckName.trim()) {
            setError('Please enter a deck name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onCreate(deckName.trim());
            onClose();
        } catch (err) {
            console.error('Create deck failed:', err);
            setError('Failed to create deck. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleCreate();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📁 Create New Deck</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="input-group">
                        <label>Deck Name</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter deck name"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            autoFocus
                        />
                    </div>

                    {error && <div className="modal-error">{error}</div>}

                    <p className="text-muted mt-2">
                        Create an empty deck to organize your flashcards.
                    </p>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleCreate}
                        disabled={loading || !deckName.trim()}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating...
                            </>
                        ) : (
                            'Create Deck'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateDeckModal;
