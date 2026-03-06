import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardsAPI } from '../api/client';
import Header from '../components/Header';
import './ImportCards.css';

function ImportCards() {
    const navigate = useNavigate();
    const [deckName, setDeckName] = useState('');
    const [rawData, setRawData] = useState('');
    const [frontBackDelimiter, setFrontBackDelimiter] = useState('tab');
    const [cardDelimiter, setCardDelimiter] = useState('newline');
    const [customFrontBack, setCustomFrontBack] = useState('');
    const [customCard, setCustomCard] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get actual delimiter characters
    const getFrontBackDelim = () => {
        switch (frontBackDelimiter) {
            case 'tab': return '\t';
            case 'comma': return ',';
            case 'custom': return customFrontBack || '\t';
            default: return '\t';
        }
    };

    const getCardDelim = () => {
        switch (cardDelimiter) {
            case 'newline': return '\n';
            case 'semicolon': return ';';
            case 'custom': return customCard || '\n';
            default: return '\n';
        }
    };

    // Parse and preview cards
    const parsedCards = useMemo(() => {
        if (!rawData.trim()) return [];

        const cardDelim = getCardDelim();
        const fbDelim = getFrontBackDelim();

        const lines = rawData.split(cardDelim).filter(line => line.trim());
        const cards = [];

        for (const line of lines) {
            const parts = line.split(fbDelim);
            if (parts.length >= 2) {
                cards.push({
                    front: parts[0].trim(),
                    back: parts.slice(1).join(fbDelim).trim()
                });
            }
        }

        return cards;
    }, [rawData, frontBackDelimiter, cardDelimiter, customFrontBack, customCard]);

    const handleImport = async () => {
        if (!deckName.trim()) {
            setError('Please enter a deck name');
            return;
        }

        if (parsedCards.length === 0) {
            setError('No valid cards found. Check your data format.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await cardsAPI.importCSV(parsedCards, deckName.trim());
            navigate('/dashboard');
        } catch (err) {
            console.error('Import failed:', err);
            setError('Failed to import cards. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="import-cards-page page">
            <header className="import-header glass">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="breadcrumb">
                    <span className="breadcrumb-link" onClick={() => navigate('/dashboard')}>Home</span>
                    <span className="breadcrumb-sep">/</span>
                    <span className="breadcrumb-current">Import cards</span>
                </div>
            </header>

            <main className="import-content">
                <div className="import-form">
                    {/* Deck Name */}
                    <input
                        type="text"
                        className="deck-name-input"
                        placeholder="Deck name"
                        value={deckName}
                        onChange={(e) => setDeckName(e.target.value)}
                    />

                    {/* Data Input */}
                    <div className="data-input-section">
                        <label className="data-label">
                            Import your data.{' '}
                            <span className="data-hint">
                                Copy and paste your data here from{' '}
                                <a href="https://quizlet.com" target="_blank" rel="noopener noreferrer" className="quizlet-link">
                                    Quizlet
                                </a>
                                , Google doc, spreadsheet, etc.
                            </span>
                        </label>
                        <textarea
                            className="data-textarea"
                            placeholder={`Front side 1\tBack side 1\nFront side 2\tBack side 2\nFront side 3\tBack side 3`}
                            value={rawData}
                            onChange={(e) => setRawData(e.target.value)}
                            rows={8}
                        />
                    </div>

                    {/* Delimiter Options */}
                    <div className="delimiter-options">
                        <div className="delimiter-group">
                            <h4>Between front and back sides</h4>
                            <div className="delimiter-choices">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="fbDelim"
                                        checked={frontBackDelimiter === 'tab'}
                                        onChange={() => setFrontBackDelimiter('tab')}
                                    />
                                    <span>Tab</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="fbDelim"
                                        checked={frontBackDelimiter === 'comma'}
                                        onChange={() => setFrontBackDelimiter('comma')}
                                    />
                                    <span>Comma</span>
                                </label>
                                <label className="radio-option custom-option">
                                    <input
                                        type="radio"
                                        name="fbDelim"
                                        checked={frontBackDelimiter === 'custom'}
                                        onChange={() => setFrontBackDelimiter('custom')}
                                    />
                                    <input
                                        type="text"
                                        className="custom-input"
                                        placeholder="Custom: e.g. -"
                                        value={customFrontBack}
                                        onChange={(e) => {
                                            setCustomFrontBack(e.target.value);
                                            setFrontBackDelimiter('custom');
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="delimiter-group">
                            <h4>Between cards</h4>
                            <div className="delimiter-choices">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="cardDelim"
                                        checked={cardDelimiter === 'newline'}
                                        onChange={() => setCardDelimiter('newline')}
                                    />
                                    <span>New line</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="cardDelim"
                                        checked={cardDelimiter === 'semicolon'}
                                        onChange={() => setCardDelimiter('semicolon')}
                                    />
                                    <span>Semicolon</span>
                                </label>
                                <label className="radio-option custom-option">
                                    <input
                                        type="radio"
                                        name="cardDelim"
                                        checked={cardDelimiter === 'custom'}
                                        onChange={() => setCardDelimiter('custom')}
                                    />
                                    <input
                                        type="text"
                                        className="custom-input"
                                        placeholder="Custom: e.g. \\n\\n"
                                        value={customCard}
                                        onChange={(e) => {
                                            setCustomCard(e.target.value);
                                            setCardDelimiter('custom');
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <div className="import-error">{error}</div>}

                    {/* Cards Preview */}
                    <div className="cards-preview">
                        <h4>Cards preview ({parsedCards.length})</h4>
                        {parsedCards.length > 0 ? (
                            <div className="preview-list">
                                {parsedCards.slice(0, 10).map((card, idx) => (
                                    <div key={idx} className="preview-card">
                                        <div className="preview-front">{card.front}</div>
                                        <div className="preview-separator">→</div>
                                        <div className="preview-back">{card.back}</div>
                                    </div>
                                ))}
                                {parsedCards.length > 10 && (
                                    <div className="preview-more">
                                        + {parsedCards.length - 10} more cards
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="preview-empty">
                                Enter your data above to see a preview
                            </div>
                        )}
                    </div>

                    {/* Import Button */}
                    <div className="import-actions">
                        <button
                            className="btn btn-primary btn-import"
                            onClick={handleImport}
                            disabled={loading || parsedCards.length === 0}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Importing...
                                </>
                            ) : (
                                <>
                                    Import {parsedCards.length} cards
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ImportCards;
